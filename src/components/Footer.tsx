import React from 'react';
import { Github, Linkedin, Globe, Instagram, Heart } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/yusufaditiya',
      color: 'hover:text-gray-300'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/yusufaditiya',
      color: 'hover:text-blue-400'
    },
    {
      icon: Globe,
      label: 'Website',
      href: 'https://yusufaditiya.com',
      color: 'hover:text-green-400'
    },
    {
      icon: Instagram,
      label: 'Instagram',
      href: 'https://instagram.com/yusufaditiya',
      color: 'hover:text-pink-400'
    }
  ];

  return (
    <footer className="bg-black border-t border-red-900/20 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Links */}
          <div className="flex items-center space-x-6">
            {socialLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${link.color} transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-red-500/20 p-2 rounded-lg hover:bg-red-600/10`}
                  aria-label={link.label}
                >
                  <IconComponent className="w-6 h-6" />
                </a>
              );
            })}
          </div>

          {/* Creator Credit */}
          <div className="flex items-center space-x-2 text-gray-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>by</span>
            <span className="font-bold text-white hover:text-red-400 transition-colors cursor-pointer">
              Muhammad Yusuf Aditiya
            </span>
          </div>

          {/* Additional Info */}
          <div className="text-center text-sm text-gray-500 space-y-1">
            <p>RAWG Game Finder - Discover your next gaming adventure</p>
            <p>Built with React, TypeScript, TailwindCSS & RAWG API</p>
          </div>
        </div>
      </div>
    </footer>
  );
}