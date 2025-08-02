import React from 'react';
import { Gamepad2, Search, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-red-500/20 rounded-full blur-2xl animate-pulse delay-1000" />

      <div className="container mx-auto text-center relative z-10">
        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-white via-gray-100 to-red-400 bg-clip-text text-transparent">
          VizGames
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Discover amazing games, find your next adventure, and explore the best titles from RAWG's comprehensive database
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <div className="group p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
            <Search className="w-8 h-8 text-red-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Smart Search</h3>
            <p className="text-gray-400">Find games by name with instant results</p>
          </div>

          <div className="group p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
            <Zap className="w-8 h-8 text-red-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Data</h3>
            <p className="text-gray-400">Live game information and ratings from RAWG</p>
          </div>

          <div className="group p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
            <Gamepad2 className="w-8 h-8 text-red-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Curated Lists</h3>
            <p className="text-gray-400">Popular, newest, and recommended games</p>
          </div>
        </div>
      </div>
    </section>
  );
}