import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, DollarSign, Calendar, Users, Star } from 'lucide-react';
import { Header } from '../components/Header';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Footer } from '../components/Footer';
import { rawgApiService as steamApi } from '../services/rawgApiService';
import { SteamGame } from '../types';

export function GameDetailsPage() {
  const { appid } = useParams<{ appid: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<SteamGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (appid) {
      loadGameDetails(parseInt(appid));
    }
  }, [appid]);

  const loadGameDetails = async (gameId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const gameData = await steamApi.getGameDetails(gameId);
      if (gameData) {
        setGame(gameData);
        steamApi.addToRecentlyViewed(gameId);
      } else {
        setError('Game not found');
      }
    } catch (err) {
      console.error('Error loading game details:', err);
      setError('Failed to load game details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <LoadingSpinner size="lg" text="Loading game details..." />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-400 text-lg mb-4">{error || 'Game not found'}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RAWG game page URL
  const rawgUrl = `https://rawg.io/games/${game.steam_appid || game.appid}`;
  
  const formatPrice = () => {
    if (game.is_free) return 'Free to Play';
    if (game.price_overview) {
      return game.price_overview.final_formatted || 'Price not available';
    }
    return 'Price not available';
  };

  const getGenres = () => {
    return game.genres?.map(genre => genre.description).join(', ') || 'Unknown';
  };

  const getDevelopers = () => {
    return game.developers?.join(', ') || 'Unknown';
  };

  const getPublishers = () => {
    return game.publishers?.join(', ') || 'Unknown';
  };

  const getReleaseDate = () => {
    return game.release_date?.date || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Games
        </button>

        {/* Game Header */}
        <div className="bg-black border border-gray-800 rounded-xl overflow-hidden mb-8">
          <div className="relative">
            <img
              src={game.header_image}
              alt={game.name}
              className="w-full h-64 md:h-96 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/460x215/1a1a1a/666666?text=No+Image';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            
            {/* Game Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                {game.name}
              </h1>
              <p className="text-xl text-gray-300">
                {game.short_description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-black border border-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">About This Game</h2>
              <div 
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: game.detailed_description || game.short_description || 'No description available.' 
                }}
              />
            </div>

            {/* Screenshots */}
            {game.screenshots && game.screenshots.length > 0 && (
              <div className="bg-black border border-gray-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Screenshots</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {game.screenshots.slice(0, 4).map((screenshot, index) => (
                    <img
                      key={index}
                      src={screenshot.path_thumbnail}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => window.open(screenshot.path_full, '_blank')}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Info */}
            <div className="bg-black border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-green-400" />
                <span className={`text-2xl font-bold ${game.is_free ? 'text-green-400' : 'text-white'}`}>
                  {formatPrice()}
                </span>
                {game.price_overview?.discount_percent && (
                  <span className="bg-red-600 text-white text-sm px-2 py-1 rounded">
                    -{game.price_overview.discount_percent}%
                  </span>
                )}
              </div>
              
              <a
                href={rawgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-medium"
              >
                <span>View on RAWG</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            {/* Game Info */}
            <div className="bg-black border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Game Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-sm">Release Date</p>
                    <p className="text-white">{getReleaseDate()}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-sm">Developer</p>
                    <p className="text-white">{getDevelopers()}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-sm">Publisher</p>
                    <p className="text-white">{getPublishers()}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-sm">Genres</p>
                    <p className="text-white">{getGenres()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Requirements */}
            {game.pc_requirements && (
              <div className="bg-black border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">System Requirements</h3>
                <div 
                  className="text-gray-300 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: game.pc_requirements.minimum || 'No system requirements available.' 
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}