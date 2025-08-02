import React from 'react';
import { Filter } from 'lucide-react';

interface GenreFilterProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

const GENRES = [
  { value: '', label: 'All Games' },
  { value: 'Action', label: 'Action' },
  { value: 'RPG', label: 'RPG' },
  { value: 'Strategy', label: 'Strategy' },
  { value: 'Simulation', label: 'Simulation' },
  { value: 'Sports', label: 'Sports' },
];

export function GenreFilter({ selectedGenre, onGenreChange }: GenreFilterProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-white">Filter by Genre</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {GENRES.map((genre) => (
          <button
            key={genre.value}
            onClick={() => onGenreChange(genre.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedGenre === genre.value
                ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-lg hover:shadow-red-500/10'
            }`}
          >
            {genre.label}
          </button>
        ))}
      </div>
    </div>
  );
}