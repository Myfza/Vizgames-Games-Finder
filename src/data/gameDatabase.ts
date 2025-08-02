// Static game database to replace Steam API dependency
export interface StaticGameData {
  appid: number;
  name: string;
  header_image: string;
  short_description: string;
  detailed_description: string;
  price_overview?: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
    initial_formatted?: string;
    final_formatted?: string;
  };
  genres: Array<{ description: string }>;
  is_free: boolean;
  screenshots: Array<{
    id: number;
    path_thumbnail: string;
    path_full: string;
  }>;
  developers: string[];
  publishers: string[];
  release_date: {
    coming_soon: boolean;
    date: string;
  };
  categories: Array<{ description: string }>;
}

export const GAME_DATABASE: StaticGameData[] = [
  {
    appid: 730,
    name: "Counter-Strike 2",
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
    short_description: "For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe.",
    detailed_description: "Counter-Strike 2 is the largest technical leap forward in Counter-Strike's history, supporting new gameplay features and updated versions of the classic maps.",
    genres: [{ description: "Action" }, { description: "FPS" }],
    is_free: true,
    screenshots: [
      {
        id: 0,
        path_thumbnail: "https://cdn.akamai.steamstatic.com/steam/apps/730/ss_34a1c2b8d8ded5a9e6b3b5e5e5e5e5e5e5e5e5e5_600x338.jpg",
        path_full: "https://cdn.akamai.steamstatic.com/steam/apps/730/ss_34a1c2b8d8ded5a9e6b3b5e5e5e5e5e5e5e5e5e5_1920x1080.jpg"
      }
    ],
    developers: ["Valve"],
    publishers: ["Valve"],
    release_date: {
      coming_soon: false,
      date: "Aug 21, 2012"
    },
    categories: [{ description: "Multi-player" }, { description: "Online PvP" }]
  },
  {
    appid: 440,
    name: "Team Fortress 2",
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/440/header.jpg",
    short_description: "Nine distinct classes provide a broad range of tactical abilities and personalities.",
    detailed_description: "Team Fortress 2 is a team-based first-person shooter multiplayer video game developed and published by Valve Corporation.",
    genres: [{ description: "Action" }, { description: "FPS" }],
    is_free: true,
    screenshots: [
      {
        id: 0,
        path_thumbnail: "https://cdn.akamai.steamstatic.com/steam/apps/440/ss_1.jpg",
        path_full: "https://cdn.akamai.steamstatic.com/steam/apps/440/ss_1_1920x1080.jpg"
      }
    ],
    developers: ["Valve"],
    publishers: ["Valve"],
    release_date: {
      coming_soon: false,
      date: "Oct 10, 2007"
    },
    categories: [{ description: "Multi-player" }, { description: "Online PvP" }]
  },
  {
    appid: 570,
    name: "Dota 2",
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg",
    short_description: "Every day, millions of players worldwide enter battle as one of over a hundred Dota heroes.",
    detailed_description: "Dota 2 is a multiplayer online battle arena (MOBA) video game developed and published by Valve Corporation.",
    genres: [{ description: "Action" }, { description: "Strategy" }, { description: "Free to Play" }],
    is_free: true,
    screenshots: [
      {
        id: 0,
        path_thumbnail: "https://cdn.akamai.steamstatic.com/steam/apps/570/ss_1.jpg",
        path_full: "https://cdn.akamai.steamstatic.com/steam/apps/570/ss_1_1920x1080.jpg"
      }
    ],
    developers: ["Valve"],
    publishers: ["Valve"],
    release_date: {
      coming_soon: false,
      date: "Jul 9, 2013"
    },
    categories: [{ description: "Multi-player" }, { description: "Online PvP" }]
  },
  {
    appid: 271590,
    name: "Grand Theft Auto V",
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg",
    short_description: "Grand Theft Auto V for PC offers players the option to explore the award-winning world of Los Santos and Blaine County.",
    detailed_description: "When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the criminal underworld.",
    price_overview: {
      currency: "USD",
      initial: 2999,
      final: 1499,
      discount_percent: 50,
      initial_formatted: "$29.99",
      final_formatted: "$14.99"
    },
    genres: [{ description: "Action" }, { description: "Adventure" }],
    is_free: false,
    screenshots: [
      {
        id: 0,
        path_thumbnail: "https://cdn.akamai.steamstatic.com/steam/apps/271590/ss_1.jpg",
        path_full: "https://cdn.akamai.steamstatic.com/steam/apps/271590/ss_1_1920x1080.jpg"
      }
    ],
    developers: ["Rockstar North"],
    publishers: ["Rockstar Games"],
    release_date: {
      coming_soon: false,
      date: "Apr 14, 2015"
    },
    categories: [{ description: "Single-player" }, { description: "Multi-player" }]
  },
  {
    appid: 1172470,
    name: "Apex Legends",
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg",
    short_description: "Apex Legends is the award-winning, free-to-play Hero Shooter from Respawn Entertainment.",
    detailed_description: "Master an ever-growing roster of legendary characters with powerful abilities and experience strategic squad play and innovative gameplay.",
    genres: [{ description: "Action" }, { description: "Free to Play" }, { description: "Battle Royale" }],
    is_free: true,
    screenshots: [
      {
        id: 0,
        path_thumbnail: "https://cdn.akamai.steamstatic.com/steam/apps/1172470/ss_1.jpg",
        path_full: "https://cdn.akamai.steamstatic.com/steam/apps/1172470/ss_1_1920x1080.jpg"
      }
    ],
    developers: ["Respawn Entertainment"],
    publishers: ["Electronic Arts"],
    release_date: {
      coming_soon: false,
      date: "Nov 4, 2020"
    },
    categories: [{ description: "Multi-player" }, { description: "Online PvP" }]
  },
  {
    appid: 252490,
    name: "Rust",
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg",
    short_description: "The only aim in Rust is to survive. Everything wants you to die.",
    detailed_description: "Rust is a multiplayer-only survival video game developed by Facepunch Studios.",
    price_overview: {
      currency: "USD",
      initial: 3999,
      final: 3999,
      discount_percent: 0,
      final_formatted: "$39.99"
    },
    genres: [{ description: "Action" }, { description: "Adventure" }, { description: "Indie" }, { description: "Massively Multiplayer" }, { description: "RPG" }],
    is_free: false,
    screenshots: [
      {
        id: 0,
        path_thumbnail: "https://cdn.akamai.steamstatic.com/steam/apps/252490/ss_1.jpg",
        path_full: "https://cdn.akamai.steamstatic.com/steam/apps/252490/ss_1_1920x1080.jpg"
      }
    ],
    developers: ["Facepunch Studios"],
    publishers: ["Facepunch Studios"],
    release_date: {
      coming_soon: false,
      date: "Feb 8, 2018"
    },
    categories: [{ description: "Multi-player" }, { description: "Online PvP" }]
  },
  {
    appid: 359550,
    name: "Tom Clancy's Rainbow Six Siege",
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/359550/header.jpg",
    short_description: "Tom Clancy's Rainbow Six Siege is an elite, realistic, tactical, team-based shooter.",
    detailed_description: "Master the art of destruction and gadgetry in Tom Clancy's Rainbow Six Siege.",
    price_overview: {
      currency: "USD",
      initial: 1999,
      final: 799,
      discount_percent: 60,
      initial_formatted: "$19.99",
      final_formatted: "$7.99"
    },
    genres: [{ description: "Action" }, { description: "FPS" }],
    is_free: false,
    screenshots: [
      {
        id: 0,
        path_thumbnail: "https://cdn.akamai.steamstatic.com/steam/apps/359550/ss_1.jpg",
        path_full: "https://cdn.akamai.steamstatic.com/steam/apps/359550/ss_1_1920x1080.jpg"
      }
    ],
    developers: ["Ubisoft Montreal"],
    publishers: ["Ubisoft"],
    release_date: {
      coming_soon: false,
      date: "Dec 1, 2015"
    },
    categories: [{ description: "Multi-player" }, { description: "Online PvP" }]
  },
  {
    appid: 435150,
    name: "Divinity: Original Sin 2 - Definitive Edition",
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/435150/header.jpg",
    short_description: "The critically acclaimed RPG that raised the bar, from the creators of Baldur's Gate 3.",
    detailed_description: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.",
    price_overview: {
      currency: "USD",
      initial: 4499,
      final: 1349,
      discount_percent: 70,
      initial_formatted: "$44.99",
      final_formatted: "$13.49"
    },
    genres: [{ description: "RPG" }, { description: "Strategy" }, { description: "Adventure" }],
    is_free: false,
    screenshots: [
      {
        id: 0,
        path_thumbnail: "https://cdn.akamai.steamstatic.com/steam/apps/435150/ss_1.jpg",
        path_full: "https://cdn.akamai.steamstatic.com/steam/apps/435150/ss_1_1920x1080.jpg"
      }
    ],
    developers: ["Larian Studios"],
    publishers: ["Larian Studios"],
    release_date: {
      coming_soon: false,
      date: "Sep 14, 2017"
    },
    categories: [{ description: "Single-player" }, { description: "Multi-player" }, { description: "Co-op" }]
  }
];

// Genre-based game collections
export const GENRE_COLLECTIONS = {
  Action: [730, 440, 570, 271590, 1172470, 252490, 359550],
  RPG: [435150, 271590],
  Strategy: [570, 435150],
  Simulation: [271590],
  Sports: []
};

// Popular games list
export const POPULAR_GAMES = [730, 440, 570, 271590, 1172470, 252490, 359550, 435150];

// Recent games (simulated)
export const RECENT_GAMES = [1172470, 435150, 359550, 252490];