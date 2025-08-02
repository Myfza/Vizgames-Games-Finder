import { SteamGame } from '../types';
import { GAME_DATABASE, GENRE_COLLECTIONS, POPULAR_GAMES, RECENT_GAMES, StaticGameData } from '../data/gameDatabase';

class StaticGameService {
  private cache = new Map<string, any>();

  // Convert static data to SteamGame format
  private convertToSteamGame(staticGame: StaticGameData): SteamGame {
    return {
      ...staticGame,
      steam_appid: staticGame.appid
    };
  }

  // Get game by ID
  async getGameDetails(appid: number): Promise<SteamGame | null> {
    const cacheKey = `game_${appid}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Simulate API delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

    const staticGame = GAME_DATABASE.find(game => game.appid === appid);
    if (!staticGame) {
      return null;
    }

    const steamGame = this.convertToSteamGame(staticGame);
    this.cache.set(cacheKey, steamGame);
    return steamGame;
  }

  // Get multiple games
  async getMultipleGameDetails(appids: number[]): Promise<SteamGame[]> {
    const promises = appids.map(appid => 
      this.getGameDetails(appid).catch(() => null)
    );
    
    const results = await Promise.allSettled(promises);
    
    const validGames = results
      .filter((result): result is PromiseFulfilledResult<SteamGame> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);

    return validGames;
  }

  // Get popular games
  async getPopularGames(): Promise<SteamGame[]> {
    return this.getMultipleGameDetails(POPULAR_GAMES);
  }

  // Get recent games
  async getRecentGames(): Promise<SteamGame[]> {
    return this.getMultipleGameDetails(RECENT_GAMES);
  }

  // Get recommended games (randomized selection)
  async getRecommendedGames(): Promise<SteamGame[]> {
    const allGames = [...POPULAR_GAMES];
    const shuffled = allGames.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 6);
    return this.getMultipleGameDetails(selected);
  }

  // Search games by name
  async searchGames(query: string): Promise<SteamGame[]> {
    if (!query.trim()) return [];

    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const filtered = GAME_DATABASE.filter(game =>
      game.name.toLowerCase().includes(query.toLowerCase()) ||
      game.short_description.toLowerCase().includes(query.toLowerCase()) ||
      game.genres.some(genre => genre.description.toLowerCase().includes(query.toLowerCase()))
    );

    return filtered.map(game => this.convertToSteamGame(game));
  }

  // Get games by genre
  async getGamesByGenre(genre: string): Promise<SteamGame[]> {
    const gameIds = GENRE_COLLECTIONS[genre as keyof typeof GENRE_COLLECTIONS] || [];
    return this.getMultipleGameDetails(gameIds);
  }

  // Mock app list for compatibility
  async getAllApps(): Promise<Array<{ appid: number; name: string }>> {
    return GAME_DATABASE.map(game => ({
      appid: game.appid,
      name: game.name
    }));
  }

  // User preferences (localStorage-based)
  getUserPreferences(): { favoriteGenres: string[]; viewMode: string } {
    const prefs = localStorage.getItem('steamGameFinderPrefs');
    return prefs ? JSON.parse(prefs) : { favoriteGenres: [], viewMode: 'grid' };
  }

  saveUserPreferences(preferences: { favoriteGenres: string[]; viewMode: string }): void {
    localStorage.setItem('steamGameFinderPrefs', JSON.stringify(preferences));
  }

  // Recently viewed games
  getRecentlyViewed(): number[] {
    const recent = localStorage.getItem('steamGameFinderRecent');
    return recent ? JSON.parse(recent) : [];
  }

  addToRecentlyViewed(appid: number): void {
    const recent = this.getRecentlyViewed();
    const filtered = recent.filter(id => id !== appid);
    filtered.unshift(appid);
    const limited = filtered.slice(0, 10);
    localStorage.setItem('steamGameFinderRecent', JSON.stringify(limited));
  }
}

export const staticGameService = new StaticGameService();