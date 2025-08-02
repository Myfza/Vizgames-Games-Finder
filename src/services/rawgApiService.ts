// RAWG API Service - Replaces Steam API functionality
import { SteamGame } from '../types';

export class RawgApiService {
  private baseUrl = 'https://api.rawg.io/api';
  private apiKey = 'ba3326f7aa2d4705ae3f031fb70c40b8';
  private cache = new Map<string, any>();

  // Convert RAWG game data to Steam game format for compatibility
  private convertRawgToSteamFormat(rawgGame: any): SteamGame {
    return {
      appid: rawgGame.id,
      steam_appid: rawgGame.id,
      name: rawgGame.name,
      header_image: rawgGame.background_image || rawgGame.background_image_additional || '',
      short_description: rawgGame.description_raw?.substring(0, 200) || rawgGame.description?.substring(0, 200) || 'No description available.',
      detailed_description: rawgGame.description_raw || rawgGame.description || 'No detailed description available.',
      price_overview: this.extractPriceInfo(rawgGame),
      genres: rawgGame.genres?.map((genre: any) => ({ description: genre.name })) || [],
      is_free: rawgGame.price === 0 || rawgGame.free_to_play || false,
      screenshots: rawgGame.short_screenshots?.map((screenshot: any, index: number) => ({
        id: index,
        path_thumbnail: screenshot.image,
        path_full: screenshot.image
      })) || [],
      developers: rawgGame.developers?.map((dev: any) => dev.name) || [],
      publishers: rawgGame.publishers?.map((pub: any) => pub.name) || [],
      release_date: {
        coming_soon: rawgGame.tba || new Date(rawgGame.released) > new Date(),
        date: rawgGame.released || 'Unknown'
      },
      categories: rawgGame.tags?.slice(0, 5).map((tag: any) => ({ description: tag.name })) || [],
      pc_requirements: {
        minimum: rawgGame.platforms?.find((p: any) => p.platform.name === 'PC')?.requirements?.minimum || 'No requirements available'
      }
    };
  }

  // Extract price information (RAWG doesn't provide pricing, so we simulate it)
  private extractPriceInfo(rawgGame: any): any {
    // RAWG doesn't provide pricing data, so we'll simulate based on game popularity and rating
    if (rawgGame.free_to_play) {
      return null; // Free games don't have price info
    }

    // Simulate pricing based on metacritic score and rating
    const basePrice = Math.max(999, Math.min(5999, Math.round((rawgGame.metacritic || 70) * 60)));
    const hasDiscount = Math.random() > 0.7; // 30% chance of discount
    const discountPercent = hasDiscount ? Math.floor(Math.random() * 50) + 10 : 0;
    const finalPrice = hasDiscount ? Math.round(basePrice * (100 - discountPercent) / 100) : basePrice;

    return hasDiscount ? {
      currency: 'USD',
      initial: basePrice,
      final: finalPrice,
      discount_percent: discountPercent,
      initial_formatted: `$${(basePrice / 100).toFixed(2)}`,
      final_formatted: `$${(finalPrice / 100).toFixed(2)}`
    } : {
      currency: 'USD',
      initial: basePrice,
      final: basePrice,
      discount_percent: 0,
      final_formatted: `$${(basePrice / 100).toFixed(2)}`
    };
  }

  // Fetch with caching and error handling
  private async fetchWithCache(url: string, cacheKey: string, ttl: number = 300000): Promise<any> {
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    try {
      const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}key=${this.apiKey}`);
      
      if (!response.ok) {
        throw new Error(`RAWG API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error(`RAWG API request failed for ${url}:`, error);
      throw error;
    }
  }

  // Get game details by ID (replaces Steam's appdetails endpoint)
  async getGameDetails(gameId: number): Promise<SteamGame | null> {
    try {
      const url = `${this.baseUrl}/games/${gameId}`;
      const cacheKey = `game_${gameId}`;
      
      const rawgGame = await this.fetchWithCache(url, cacheKey);
      return this.convertRawgToSteamFormat(rawgGame);
    } catch (error) {
      console.error(`Failed to fetch game details for ID ${gameId}:`, error);
      return null;
    }
  }

  // Get multiple game details (replaces Steam's batch requests)
  async getMultipleGameDetails(gameIds: number[]): Promise<SteamGame[]> {
    const promises = gameIds.map(id => 
      this.getGameDetails(id).catch(error => {
        console.error(`Failed to fetch game ${id}:`, error);
        return null;
      })
    );

    const results = await Promise.allSettled(promises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<SteamGame> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
  }

  // Search games (replaces Steam's search functionality)
  async searchGames(query: string): Promise<SteamGame[]> {
    if (!query.trim()) return [];

    try {
      const url = `${this.baseUrl}/games`;
      const cacheKey = `search_${query.toLowerCase()}`;
      
      const params = new URLSearchParams({
        search: query,
        page_size: '20',
        ordering: '-rating'
      });

      const data = await this.fetchWithCache(`${url}?${params}`, cacheKey, 180000); // 3 min cache
      
      return data.results?.map((game: any) => this.convertRawgToSteamFormat(game)) || [];
    } catch (error) {
      console.error('RAWG search failed:', error);
      return [];
    }
  }

  // Get popular games (replaces Steam's popular games)
  async getPopularGames(): Promise<SteamGame[]> {
    try {
      const url = `${this.baseUrl}/games`;
      const cacheKey = 'popular_games';
      
      const params = new URLSearchParams({
        ordering: '-rating',
        page_size: '20',
        metacritic: '80,100' // High-rated games
      });

      const data = await this.fetchWithCache(`${url}?${params}`, cacheKey, 600000); // 10 min cache
      
      return data.results?.map((game: any) => this.convertRawgToSteamFormat(game)) || [];
    } catch (error) {
      console.error('Failed to fetch popular games:', error);
      return [];
    }
  }

  // Get recent games (replaces Steam's new releases)
  async getRecentGames(): Promise<SteamGame[]> {
    try {
      const url = `${this.baseUrl}/games`;
      const cacheKey = 'recent_games';
      
      // Get games from the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const params = new URLSearchParams({
        dates: `${sixMonthsAgo.toISOString().split('T')[0]},${new Date().toISOString().split('T')[0]}`,
        ordering: '-released',
        page_size: '20'
      });

      const data = await this.fetchWithCache(`${url}?${params}`, cacheKey, 600000); // 10 min cache
      
      return data.results?.map((game: any) => this.convertRawgToSteamFormat(game)) || [];
    } catch (error) {
      console.error('Failed to fetch recent games:', error);
      return [];
    }
  }

  // Get recommended games (replaces Steam's recommendations)
  async getRecommendedGames(): Promise<SteamGame[]> {
    try {
      const url = `${this.baseUrl}/games`;
      const cacheKey = 'recommended_games';
      
      const params = new URLSearchParams({
        ordering: '-added',
        page_size: '20',
        rating: '4,5' // Highly rated games
      });

      const data = await this.fetchWithCache(`${url}?${params}`, cacheKey, 600000); // 10 min cache
      
      return data.results?.map((game: any) => this.convertRawgToSteamFormat(game)) || [];
    } catch (error) {
      console.error('Failed to fetch recommended games:', error);
      return [];
    }
  }

  // Get games by genre (replaces Steam's genre filtering)
  async getGamesByGenre(genreName: string): Promise<SteamGame[]> {
    try {
      const url = `${this.baseUrl}/games`;
      const cacheKey = `genre_${genreName.toLowerCase()}`;
      
      const params = new URLSearchParams({
        genres: genreName.toLowerCase(),
        ordering: '-rating',
        page_size: '20'
      });

      const data = await this.fetchWithCache(`${url}?${params}`, cacheKey, 600000); // 10 min cache
      
      return data.results?.map((game: any) => this.convertRawgToSteamFormat(game)) || [];
    } catch (error) {
      console.error(`Failed to fetch games for genre ${genreName}:`, error);
      return [];
    }
  }

  // Get all available genres (replaces Steam's genre list)
  async getGenres(): Promise<Array<{ id: number; name: string }>> {
    try {
      const url = `${this.baseUrl}/genres`;
      const cacheKey = 'all_genres';
      
      const data = await this.fetchWithCache(url, cacheKey, 3600000); // 1 hour cache
      
      return data.results?.map((genre: any) => ({
        id: genre.id,
        name: genre.name
      })) || [];
    } catch (error) {
      console.error('Failed to fetch genres:', error);
      return [];
    }
  }

  // Get app list equivalent (for compatibility)
  async getAllApps(): Promise<Array<{ appid: number; name: string }>> {
    try {
      const url = `${this.baseUrl}/games`;
      const cacheKey = 'all_apps';
      
      const params = new URLSearchParams({
        page_size: '100',
        ordering: '-rating'
      });

      const data = await this.fetchWithCache(`${url}?${params}`, cacheKey, 3600000); // 1 hour cache
      
      return data.results?.map((game: any) => ({
        appid: game.id,
        name: game.name
      })) || [];
    } catch (error) {
      console.error('Failed to fetch app list:', error);
      return [];
    }
  }

  // User preferences (localStorage-based, unchanged from Steam implementation)
  getUserPreferences(): { favoriteGenres: string[]; viewMode: string } {
    const prefs = localStorage.getItem('gameFinderPrefs');
    return prefs ? JSON.parse(prefs) : { favoriteGenres: [], viewMode: 'grid' };
  }

  saveUserPreferences(preferences: { favoriteGenres: string[]; viewMode: string }): void {
    localStorage.setItem('gameFinderPrefs', JSON.stringify(preferences));
  }

  // Recently viewed games (localStorage-based, unchanged from Steam implementation)
  getRecentlyViewed(): number[] {
    const recent = localStorage.getItem('gameFinderRecent');
    return recent ? JSON.parse(recent) : [];
  }

  addToRecentlyViewed(appid: number): void {
    const recent = this.getRecentlyViewed();
    const filtered = recent.filter(id => id !== appid);
    filtered.unshift(appid);
    const limited = filtered.slice(0, 10);
    localStorage.setItem('gameFinderRecent', JSON.stringify(limited));
  }
}

export const rawgApiService = new RawgApiService();