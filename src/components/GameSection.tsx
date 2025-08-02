import React from 'react';
import { GameCard } from './GameCard';
import { LoadingSpinner } from './LoadingSpinner';
import { SteamGame } from '../types';

interface GameSectionProps {
  title: string;
  games: SteamGame[];
  loading?: boolean;
  icon?: React.ReactNode;
  onGameClick?: (appid: number) => void;
}

export function GameSection({ title, games, loading, icon, onGameClick }: GameSectionProps) {
  return (
    <section className="py-8">
      <div className="flex items-center gap-3 mb-6">
        {icon && <div className="text-red-500">{icon}</div>}
        <h2 className="text-3xl font-bold text-white">{title}</h2>
      </div>

      {loading ? (
        <LoadingSpinner text={`Loading ${title.toLowerCase()}...`} />
      ) : games.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No games found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard 
              key={game.appid || game.steam_appid} 
              game={game} 
              onGameClick={onGameClick}
            />
          ))}
        </div>
      )}
    </section>
  );
}