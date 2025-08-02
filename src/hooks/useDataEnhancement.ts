// Custom hook for managing data enhancement state
import { useState, useEffect } from 'react';
import { GameData } from '../types/dataTypes';

export function useDataEnhancement(gameId: number) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementProgress, setEnhancementProgress] = useState(0);
  const [lastEnhanced, setLastEnhanced] = useState<string | null>(null);

  useEffect(() => {
    // Listen for data enhancement events
    const handleDataUpdate = (event: CustomEvent) => {
      if (event.detail.appid === gameId) {
        setIsEnhancing(false);
        setEnhancementProgress(100);
        setLastEnhanced(new Date().toISOString());
        
        // Reset progress after animation
        setTimeout(() => setEnhancementProgress(0), 2000);
      }
    };

    window.addEventListener('gameDataUpdated', handleDataUpdate as EventListener);
    
    return () => {
      window.removeEventListener('gameDataUpdated', handleDataUpdate as EventListener);
    };
  }, [gameId]);

  const startEnhancement = () => {
    setIsEnhancing(true);
    setEnhancementProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setEnhancementProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90; // Wait for actual completion
        }
        return prev + 10;
      });
    }, 200);
  };

  return {
    isEnhancing,
    enhancementProgress,
    lastEnhanced,
    startEnhancement
  };
}