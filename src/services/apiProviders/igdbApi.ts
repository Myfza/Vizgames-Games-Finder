// IGDB API integration
import { GameData } from '../../types/dataTypes';

export class IGDBApiService {
  private baseUrl = 'https://api.igdb.com/v4';
  private clientId = import.meta.env.VITE_IGDB_CLIENT_ID || '';
  private accessToken = import.meta.env.VITE_IGDB_ACCESS_TOKEN || '';
  private rateLimit = { requests: 4, window: 1000 };
  private lastRequest = 0;
  private requestCount = 0;

  // ⛔ TADI DI SINI KAMU SALAH TARUH `}`

  private async rateLimitCheck(): Promise<void> {
    const now = Date.now();

    if (now - this.lastRequest > this.rateLimit.window) {
      this.requestCount = 0;
      this.lastRequest = now;
    }

    if (this.requestCount >= this.rateLimit.requests) {
      const waitTime = this.rateLimit.window - (now - this.lastRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.lastRequest = Date.now();
    }

    this.requestCount++;
  }


  async searchGames(query: string): Promise<GameData[]> {
    if (!this.clientId || !this.accessToken) {
      throw new Error('IGDB API credentials not configured');
    }

    await this.rateLimitCheck();
    
    try {
      const response = await fetch(`${this.baseUrl}/games`, {
        method: 'POST',
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: `search "${query}"; fields name,cover.url,summary,genres.name,screenshots.url,involved_companies.company.name,first_release_date; limit 20;`
      });
      
      if (!response.ok) throw new Error(`IGDB API error: ${response.status}`);
      
      const data = await response.json();
      return this.transformIGDBData(data);
    } catch (error) {
      console.error('IGDB API search failed:', error);
      throw error;
    }
  }

  async getGameDetails(gameId: number): Promise<GameData | null> {
    if (!this.clientId || !this.accessToken) {
      throw new Error('IGDB API credentials not configured');
    }

    await this.rateLimitCheck();
    
    try {
      const response = await fetch(`${this.baseUrl}/games`, {
        method: 'POST',
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: `where id = ${gameId}; fields *; limit 1;`
      });
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`IGDB API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.length > 0 ? this.transformIGDBGameData(data[0]) : null;
    } catch (error) {
      console.error('IGDB API game details failed:', error);
      throw error;
    }
  }

  private transformIGDBData(igdbGames: any[]): GameData[] {
    return igdbGames.map(game => ({
      appid: game.id,
      name: game.name,
      header_image: game.cover?.url ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}` : '',
      short_description: game.summary?.substring(0, 200) || '',
      detailed_description: game.summary || '',
      genres: game.genres?.map((g: any) => ({ description: g.name })) || [],
      is_free: false,
      screenshots: game.screenshots?.map((ss: any, index: number) => ({
        id: index,
        path_thumbnail: `https:${ss.url.replace('t_thumb', 't_screenshot_med')}`,
        path_full: `https:${ss.url.replace('t_thumb', 't_screenshot_huge')}`
      })) || [],
      developers: game.involved_companies?.filter((ic: any) => ic.developer)
        .map((ic: any) => ic.company.name) || [],
      publishers: game.involved_companies?.filter((ic: any) => ic.publisher)
        .map((ic: any) => ic.company.name) || [],
      release_date: {
        coming_soon: game.first_release_date ? new Date(game.first_release_date * 1000) > new Date() : false,
        date: game.first_release_date ? new Date(game.first_release_date * 1000).toLocaleDateString() : 'Unknown'
      },
      categories: [],
      dataSource: 'igdb' as const,
      lastUpdated: new Date().toISOString(),
      confidence: 0.9
    }));
  }

  private transformIGDBGameData(game: any): GameData {
    return this.transformIGDBData([game])[0];
  }
}