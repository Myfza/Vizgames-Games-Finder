// Main hybrid data service orchestrating all data sources
import { GameData, APIProvider } from '../types/dataTypes';
import { staticGameService } from './staticGameService';
import { RAWGApiService } from './apiProviders/rawgApi';
import { IGDBApiService } from './apiProviders/igdbApi';
import { CacheService } from './cacheService';
import { UserContentService } from './userContentService';

export class HybridDataService {
  private rawgApi = new RAWGApiService();
  private igdbApi = new IGDBApiService();
  private cache = new CacheService();
  private userContent = new UserContentService();
  
  private apiProviders: APIProvider[] = [
    {
      name: 'rawg',
      baseUrl: 'https://api.rawg.io/api',
      rateLimit: { requests: 20000, window: 3600000 },
      reliability: 0.9,
      coverage: ['games', 'search', 'genres']
    },
    {
      name: 'igdb',
      baseUrl: 'https://api.igdb.com/v4',
      rateLimit: { requests: 4, window: 1000 },
      reliability: 0.95,
      coverage: ['games', 'detailed_info', 'screenshots']
    }
  ];

  constructor() {
    this.cache.restore();
    
    // Persist cache periodically
    setInterval(() => {
      this.cache.persist();
    }, 300000); // Every 5 minutes
  }

  async getGameDetails(appid: number): Promise<GameData | null> {
    const cacheKey = `game_${appid}`;
    
    // 1. Check cache first
    const cached = this.cache.get<GameData>(cacheKey);
    if (cached) {
      // Asynchronously refresh if data is getting old
      if (Date.now() - new Date(cached.lastUpdated).getTime() > 1800000) { // 30 minutes
        this.refreshGameData(appid).catch(console.error);
      }
      return cached;
    }

    // 2. Try to get from static data immediately
    const staticGame = await staticGameService.getGameDetails(appid);
    let bestGame = staticGame;

    if (staticGame) {
      this.cache.set(cacheKey, staticGame, 3600000, 'static');
    }

    // 3. Enhance with API data asynchronously
    this.enhanceGameData(appid, staticGame).then(enhancedGame => {
      if (enhancedGame && enhancedGame.confidence > (bestGame?.confidence || 0)) {
        this.cache.set(cacheKey, enhancedGame, 7200000, enhancedGame.dataSource);
        // Trigger UI update if needed
        this.notifyDataUpdate(appid, enhancedGame);
      }
    }).catch(console.error);

    // 4. Apply user contributions
    if (bestGame) {
      bestGame = await this.userContent.applyUserContributions(bestGame);
    }

    return bestGame;
  }

  async searchGames(query: string): Promise<GameData[]> {
    const cacheKey = `search_${query.toLowerCase()}`;
    
    // Check cache
    const cached = this.cache.get<GameData[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Start with static search
    const staticResults = await staticGameService.searchGames(query);
    let allResults = [...staticResults];

    // Cache static results immediately
    this.cache.set(cacheKey, staticResults, 1800000, 'static');

    // Enhance with API results
    try {
      const apiResults = await this.searchFromAPIs(query);
      
      // Merge and deduplicate results
      const mergedResults = this.mergeSearchResults(staticResults, apiResults);
      
      // Cache enhanced results
      this.cache.set(cacheKey, mergedResults, 3600000, 'hybrid');
      
      return mergedResults;
    } catch (error) {
      console.warn('API search failed, using static results:', error);
      return staticResults;
    }
  }

  async getPopularGames(): Promise<GameData[]> {
    const cacheKey = 'popular_games';
    
    const cached = this.cache.get<GameData[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Get static popular games
    const staticGames = await staticGameService.getPopularGames();
    this.cache.set(cacheKey, staticGames, 1800000, 'static');

    // Enhance asynchronously
    this.enhanceGameList(staticGames).then(enhanced => {
      this.cache.set(cacheKey, enhanced, 3600000, 'hybrid');
    }).catch(console.error);

    return staticGames;
  }

  private async enhanceGameData(appid: number, baseGame: GameData | null): Promise<GameData | null> {
    const enhancementPromises = [];

    // Try RAWG first (higher rate limit)
    enhancementPromises.push(
      this.rawgApi.getGameDetails(appid).catch(() => null)
    );

    // Try IGDB (more detailed data)
    enhancementPromises.push(
      this.igdbApi.getGameDetails(appid).catch(() => null)
    );

    const results = await Promise.allSettled(enhancementPromises);
    const apiGames = results
      .filter((result): result is PromiseFulfilledResult<GameData> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);

    if (apiGames.length === 0) {
      return baseGame;
    }

    // Merge data from multiple sources
    return this.mergeGameData(baseGame, apiGames);
  }

  private async searchFromAPIs(query: string): Promise<GameData[]> {
    const searchPromises = [
      this.rawgApi.searchGames(query).catch(() => []),
      this.igdbApi.searchGames(query).catch(() => [])
    ];

    const results = await Promise.allSettled(searchPromises);
    const allApiResults = results
      .filter((result): result is PromiseFulfilledResult<GameData[]> => 
        result.status === 'fulfilled'
      )
      .flatMap(result => result.value);

    return allApiResults;
  }

  private mergeGameData(baseGame: GameData | null, apiGames: GameData[]): GameData {
    if (!baseGame && apiGames.length === 0) {
      throw new Error('No game data to merge');
    }

    // Start with the highest confidence game
    let merged = baseGame || apiGames[0];
    const sources = [baseGame, ...apiGames].filter(Boolean);

    // Merge fields based on confidence and recency
    for (const source of sources) {
      if (!source) continue;

      // Prefer more recent data for price information
      if (source.price_overview && 
          (!merged.price_overview || 
           new Date(source.lastUpdated) > new Date(merged.lastUpdated))) {
        merged.price_overview = source.price_overview;
      }

      // Prefer more detailed descriptions
      if (source.detailed_description && 
          source.detailed_description.length > (merged.detailed_description?.length || 0)) {
        merged.detailed_description = source.detailed_description;
      }

      // Merge screenshots (take the best quality)
      if (source.screenshots && source.screenshots.length > merged.screenshots.length) {
        merged.screenshots = source.screenshots;
      }

      // Merge genres (combine unique)
      const existingGenres = new Set(merged.genres.map(g => g.description));
      for (const genre of source.genres) {
        if (!existingGenres.has(genre.description)) {
          merged.genres.push(genre);
        }
      }
    }

    // Update metadata
    merged.lastUpdated = new Date().toISOString();
    merged.confidence = Math.max(...sources.map(s => s?.confidence || 0));
    merged.dataSource = 'hybrid' as any;

    return merged;
  }

  private mergeSearchResults(staticResults: GameData[], apiResults: GameData[]): GameData[] {
    const gameMap = new Map<string, GameData>();

    // Add static results first
    for (const game of staticResults) {
      gameMap.set(game.name.toLowerCase(), game);
    }

    // Merge API results
    for (const apiGame of apiResults) {
      const key = apiGame.name.toLowerCase();
      const existing = gameMap.get(key);
      
      if (existing) {
        // Merge with existing
        gameMap.set(key, this.mergeGameData(existing, [apiGame]));
      } else {
        // Add new game
        gameMap.set(key, apiGame);
      }
    }

    return Array.from(gameMap.values())
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 20); // Limit results
  }

  private async enhanceGameList(games: GameData[]): Promise<GameData[]> {
    const enhancementPromises = games.map(game => 
      this.enhanceGameData(game.appid, game).catch(() => game)
    );

    return Promise.all(enhancementPromises);
  }

  private async refreshGameData(appid: number): Promise<void> {
    try {
      const enhanced = await this.enhanceGameData(appid, null);
      if (enhanced) {
        this.cache.set(`game_${appid}`, enhanced, 7200000, enhanced.dataSource);
        this.notifyDataUpdate(appid, enhanced);
      }
    } catch (error) {
      console.error('Failed to refresh game data:', error);
    }
  }

  private notifyDataUpdate(appid: number, game: GameData): void {
    // Emit custom event for UI updates
    window.dispatchEvent(new CustomEvent('gameDataUpdated', {
      detail: { appid, game }
    }));
  }

  // User content integration
  async submitUserContribution(gameId: number, field: string, newValue: any): Promise<void> {
    return this.userContent.submitContribution(gameId, field, newValue);
  }

  async getUserContributions(gameId: number): Promise<any[]> {
    return this.userContent.getContributions(gameId);
  }

  // Analytics and monitoring
  getServiceStats(): any {
    return {
      cache: this.cache.getStats(),
      apiProviders: this.apiProviders.map(provider => ({
        name: provider.name,
        reliability: provider.reliability,
        coverage: provider.coverage
      }))
    };
  }
}

export const hybridDataService = new HybridDataService();