import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { rawgApiService as steamApi } from '../services/rawgApiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_GENRES = ['Action', 'RPG', 'Strategy', 'Simulation', 'Sports'];
const VIEW_MODES = [
  { value: 'grid', label: 'Grid View' },
  { value: 'list', label: 'List View' }
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    if (isOpen) {
      const prefs = steamApi.getUserPreferences();
      setFavoriteGenres(prefs.favoriteGenres);
      setViewMode(prefs.viewMode);
    }
  }, [isOpen]);

  const handleSave = () => {
    steamApi.saveUserPreferences({ favoriteGenres, viewMode });
    onClose();
  };

  const toggleGenre = (genre: string) => {
    setFavoriteGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Favorite Genres */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Favorite Genres</h3>
          <div className="space-y-2">
            {AVAILABLE_GENRES.map(genre => (
              <label key={genre} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={favoriteGenres.includes(genre)}
                  onChange={() => toggleGenre(genre)}
                  className="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                />
                <span className="text-gray-300">{genre}</span>
              </label>
            ))}
          </div>
        </div>

        {/* View Mode */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">View Mode</h3>
          <div className="space-y-2">
            {VIEW_MODES.map(mode => (
              <label key={mode.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="viewMode"
                  value={mode.value}
                  checked={viewMode === mode.value}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 focus:ring-red-500 focus:ring-2"
                />
                <span className="text-gray-300">{mode.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}