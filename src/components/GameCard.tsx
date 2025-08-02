import React from 'react';
import { ExternalLink, DollarSign, Eye, Edit, Zap } from 'lucide-react';
import { SteamGame } from '../types';
import { rawgApiService } from '../services/rawgApiService';

interface GameCardProps {
  game: SteamGame;
  onGameClick?: (appid: number) => void;
}

export function GameCard({ game, onGameClick }: GameCardProps) {
  // RAWG doesn't have a direct store page, so we'll link to RAWG game page
  const rawgUrl = `https://rawg.io/games/${game.steam_appid || game.appid}`;
  
  const formatPrice = () => {
    if (game.is_free) return 'Free';
    if (game.price_overview) {
      return game.price_overview.final_formatted || 'Price not available';
    }
    return 'Price not available';
  };

  const getGenres = () => {
    return game.genres?.slice(0, 3).map(genre => genre.description).join(', ') || 'Unknown';
  };

  const handleCardClick = () => {
    const appid = game.steam_appid || game.appid;
    rawgApiService.addToRecentlyViewed(appid);
    if (onGameClick) {
      onGameClick(appid);
    }
  };

  return (
    <div className="group bg-black border border-gray-800 rounded-xl overflow-hidden hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 cursor-pointer">
      {/* Image */}
      <div className="relative overflow-hidden" onClick={handleCardClick}>
        <img
          src={game.header_image}
          alt={game.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/460x215/1a1a1a/666666?text=No+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/70 rounded-full p-2">
            <Eye className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
        <h3 
            className="text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-200 line-clamp-1 cursor-pointer flex-1"
          onClick={handleCardClick}
        >
          {game.name}
        </h3>
        </div>

        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
          {game.short_description || 'No description available.'}
        </p>

        {/* Genres */}
        <div className="mb-4">
          <span className="text-xs text-gray-400 font-medium">Genres: </span>
          <span className="text-xs text-gray-300">{getGenres()}</span>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className={`font-bold ${game.is_free ? 'text-green-400' : 'text-white'}`}>
              {formatPrice()}
            </span>
            {game.price_overview?.discount_percent ? (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                -{game.price_overview.discount_percent}%
              </span>
            ) : null}
          </div>

          <a
            href={rawgUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 text-sm font-medium"
          >
            <span>View on RAWG</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}