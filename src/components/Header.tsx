import React from 'react';
import { Search, Gamepad2, Settings } from 'lucide-react';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
  onSettingsClick?: () => void;
}

export function Header({ onSearchChange, searchQuery = '', onSettingsClick }: HeaderProps) {
  return (
    <header className="bg-black/90 backdrop-blur-sm border-b border-red-900/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">
              Vizgames
            </h1>
          </div>

          {/* Search Bar */}
          {onSearchChange && (
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all duration-200 hover:border-red-600/50"
                />
              </div>
            </div>
          )}

          {/* Settings Button */}
          {onSettingsClick && (
            <button
              onClick={onSettingsClick}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:block">Settings</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}