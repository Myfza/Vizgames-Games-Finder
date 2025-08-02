// RAWG API integration
import { GameData } from '../../types/dataTypes';

export class RAWGApiService {
  private baseUrl = 'https://api.rawg.io/api';
  private apiKey = import.meta.VITE_RAWG_API_KEY || 'demo-key';
  private rateLimit = { requests: 20000, window: 3600000 }; // 20k per hour
  private lastRequest = 0;
  private requestCount = 0;

  private async rateLimitCheck(): Promise<void> {
    const now = Date.now();
    if (now - this.lastRequest > this.rateLimit.window) {
      this.requestCount = 0;
      this.lastRequest = now;
    }
    
    if (this.requestCount >= this.rateLimit.requests) {
      const waitTime = this.rateLimit.window - (now - this.lastRequest);
      throw new Error(`Rate limit exceeded. Wait ${waitTime}ms`);
    }
    
    this.requestCount++;
  }

  async searchGames(query: string): Promise<GameData[]> {
    await this.rateLimitCheck();
    
    try {
      const response = await fetch(
        `${this.baseUrl}/games?key=${this.apiKey}&search=${encodeURIComponent(query)}&page_size=20`
      );
      
      if (!response.ok) throw new Error(`RAWG API error: ${response.status}`);
      
      const data = await response.json();
      return this.transformRAWGData(data.results);
    } catch (error) {
      console.error('RAWG API search failed:', error);
      throw error;
    }
  }

  async getGameDetails(gameId: number): Promise<GameData | null> {
    await this.rateLimitCheck();
    
    try {
      const response = await fetch(`${this.baseUrl}/games/${gameId}?key=${this.apiKey}`);
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`RAWG API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformRAWGGameData(data);
    } catch (error) {
      console.error('RAWG API game details failed:', error);
      throw error;
    }
  }

  private transformRAWGData(rawgGames: any[]): GameData[] {
    return rawgGames.map(game => ({
      appid: game.id,
      name: game.name,
      header_image: game.background_image || '',
      short_description: game.description_raw?.substring(0, 200) || '',
      detailed_description: game.description_raw || '',
      genres: game.genres?.map((g: any) => ({ description: g.name })) || [],
      is_free: false, // RAWG doesn't provide pricing info
      screenshots: game.short_screenshots?.map((ss: any, index: number) => ({
        id: index,
        path_thumbnail: ss.image,
        path_full: ss.image
      })) || [],
      developers: game.developers?.map((d: any) => d.name) || [],
      publishers: game.publishers?.map((p: any) => p.name) || [],
      release_date: {
        coming_soon: new Date(game.released) > new Date(),
        date: game.released || 'Unknown'
      },
      categories: game.tags?.slice(0, 5).map((t: any) => ({ description: t.name })) || [],
      dataSource: 'rawg' as const,
      lastUpdated: new Date().toISOString(),
      confidence: 0.8
    }));
  }

  private transformRAWGGameData(game: any): GameData {
    return {
      appid: game.id,
      name: game.name,
      header_image: game.background_image || '',
      short_description: game.description_raw?.substring(0, 200) || '',
      detailed_description: game.description_raw || '',
      genres: game.genres?.map((g: any) => ({ description: g.name })) || [],
      is_free: false,
      screenshots: game.screenshots?.map((ss: any, index: number) => ({
        id: index,
        path_thumbnail: ss.image,
        path_full: ss.image
      })) || [],
      developers: game.developers?.map((d: any) => d.name) || [],
      publishers: game.publishers?.map((p: any) => p.name) || [],
      release_date: {
        coming_soon: new Date(game.released) > new Date(),
        date: game.released || 'Unknown'
      },
      categories: game.tags?.slice(0, 5).map((t: any) => ({ description: t.name })) || [],
      dataSource: 'rawg' as const,
      lastUpdated: new Date().toISOString(),
      confidence: 0.8
    };
  }
}