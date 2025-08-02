export interface SteamGame {
  appid: number;
  name: string;
  header_image?: string;
  short_description?: string;
  price_overview?: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
    initial_formatted?: string;
    final_formatted?: string;
  };
  genres?: Array<{ description: string }>;
  steam_appid?: number;
  is_free?: boolean;
  detailed_description?: string;
  screenshots?: Array<{
    id: number;
    path_thumbnail: string;
    path_full: string;
  }>;
  developers?: string[];
  publishers?: string[];
  release_date?: {
    coming_soon: boolean;
    date: string;
  };
  pc_requirements?: {
    minimum?: string;
    recommended?: string;
  };
  categories?: Array<{ description: string }>;
}

export interface SteamAppList {
  appid: number;
  name: string;
}

export interface User {
  id: string;
  email: string;
}