import React, { useState, useEffect } from 'react';
import { Flame, Star, Sparkles, Clock } from 'lucide-react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { GameSection } from '../components/GameSection';
import { GenreFilter } from '../components/GenreFilter';
import { Footer } from '../components/Footer';
import { SettingsModal } from '../components/SettingsModal';
import { rawgApiService as steamApi } from '../services/rawgApiService';
import { SteamGame } from '../types';

export function HomePage() {
  const [popularGames, setPopularGames] = useState<SteamGame[]>([]);
  const [recentGames, setRecentGames] = useState<SteamGame[]>([]);
  const [recommendedGames, setRecommendedGames] = useState<SteamGame[]>([]);
  const [recentlyViewedGames, setRecentlyViewedGames] = useState<SteamGame[]>([]);
  const [searchResults, setSearchResults] = useState<SteamGame[]>([]);
  const [genreGames, setGenreGames] = useState<SteamGame[]>([]);

  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [loadingRecentlyViewed, setLoadingRecentlyViewed] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingGenre, setLoadingGenre] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Load initial data
  useEffect(() => {
    loadPopularGames();
    loadRecentGames();
    loadRecommendedGames();
    loadRecentlyViewedGames();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Handle genre filter
  useEffect(() => {
    if (selectedGenre) {
      handleGenreFilter(selectedGenre);
    } else {
      setGenreGames([]);
    }
  }, [selectedGenre]);

  const loadPopularGames = async () => {
    try {
      const games = await steamApi.getPopularGames();
      setPopularGames(games);
    } catch (error) {
      console.error('Error loading popular games:', error);
    } finally {
      setLoadingPopular(false);
    }
  };

  const loadRecentGames = async () => {
    try {
      const games = await steamApi.getRecentGames();
      setRecentGames(games);
    } catch (error) {
      console.error('Error loading recent games:', error);
    } finally {
      setLoadingRecent(false);
    }
  };

  const loadRecommendedGames = async () => {
    try {
      const games = await steamApi.getRecommendedGames();
      setRecommendedGames(games);
    } catch (error) {
      console.error('Error loading recommended games:', error);
    } finally {
      setLoadingRecommended(false);
    }
  };

  const loadRecentlyViewedGames = async () => {
    setLoadingRecentlyViewed(true);
    try {
      const recentIds = steamApi.getRecentlyViewed();
      if (recentIds.length > 0) {
        const games = await steamApi.getMultipleGameDetails(recentIds);
        setRecentlyViewedGames(games);
      }
    } catch (error) {
      console.error('Error loading recently viewed games:', error);
    } finally {
      setLoadingRecentlyViewed(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoadingSearch(true);
    try {
      const results = await steamApi.searchGames(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleGenreFilter = async (genre: string) => {
    setLoadingGenre(true);
    try {
      const games = await steamApi.getGamesByGenre(genre);
      setGenreGames(games);
    } catch (error) {
      console.error('Genre filter error:', error);
      setGenreGames([]);
    } finally {
      setLoadingGenre(false);
    }
  };

  const handleGameClick = (appid: number) => {
    // Refresh recently viewed section
    loadRecentlyViewedGames();
  };

  const showSearchResults = searchQuery.trim() !== '';
  const showGenreResults = selectedGenre !== '';
  const showRecentlyViewed = recentlyViewedGames.length > 0;

  return (
    <div className="min-h-screen bg-gray-950">
      <Header 
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        onSettingsClick={() => setShowSettings(true)}
      />

      <HeroSection />

      <main className="container mx-auto px-4 py-8">
        {/* Genre Filter */}
        <GenreFilter 
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
        />

        {/* Search Results */}
        {showSearchResults && (
          <GameSection
            title={`Search Results for "${searchQuery}"`}
            games={searchResults}
            loading={loadingSearch}
            icon={<Star className="w-8 h-8" />}
            onGameClick={handleGameClick}
          />
        )}

        {/* Genre Results */}
        {showGenreResults && !showSearchResults && (
          <GameSection
            title={`${selectedGenre} Games`}
            games={genreGames}
            loading={loadingGenre}
            icon={<Sparkles className="w-8 h-8" />}
            onGameClick={handleGameClick}
          />
        )}

        {/* Default Sections (show when no search or genre filter) */}
        {!showSearchResults && !showGenreResults && (
          <>
            {/* Recently Viewed */}
            {showRecentlyViewed && (
              <GameSection
                title="Recently Viewed"
                games={recentlyViewedGames}
                loading={loadingRecentlyViewed}
                icon={<Clock className="w-8 h-8" />}
                onGameClick={handleGameClick}
              />
            )}

            <GameSection
              title="Popular Games"
              games={popularGames}
              loading={loadingPopular}
              icon={<Flame className="w-8 h-8" />}
              onGameClick={handleGameClick}
            />

            <GameSection
              title="Recent Games"
              games={recentGames}
              loading={loadingRecent}
              icon={<Star className="w-8 h-8" />}
              onGameClick={handleGameClick}
            />

            <GameSection
              title="Recommended for You"
              games={recommendedGames}
              loading={loadingRecommended}
              icon={<Sparkles className="w-8 h-8" />}
              onGameClick={handleGameClick}
            />
          </>
        )}
      </main>

      <Footer />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}