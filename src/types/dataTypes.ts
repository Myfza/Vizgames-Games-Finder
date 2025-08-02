// Enhanced type definitions for hybrid data system
export interface GameData {
  appid: number;
  name: string;
  header_image: string;
  short_description: string;
  detailed_description?: string;
  price_overview?: PriceData;
  genres: Genre[];
  is_free: boolean;
  screenshots: Screenshot[];
  developers: string[];
  publishers: string[];
  release_date: ReleaseDate;
  categories: Category[];
  
  // Data source tracking
  dataSource: 'static' | 'steam' | 'rawg' | 'igdb' | 'user';
  lastUpdated: string;
  confidence: number; // 0-1 score for data reliability
  userContributions?: UserContribution[];
}

export interface PriceData {
  currency: string;
  initial: number;
  final: number;
  discount_percent: number;
  initial_formatted?: string;
  final_formatted?: string;
  source: string;
  lastUpdated: string;
}

export interface UserContribution {
  id: string;
  userId: string;
  field: string;
  oldValue: any;
  newValue: any;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  votes: { up: number; down: number };
}

export interface APIProvider {
  name: string;
  baseUrl: string;
  apiKey?: string;
  rateLimit: { requests: number; window: number };
  reliability: number;
  coverage: string[];
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  source: string;
}