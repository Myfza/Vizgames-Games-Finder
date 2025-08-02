// Component to show data source and enhancement status
import React from 'react';
import { Zap, Database, Users, Layers, Wifi, WifiOff } from 'lucide-react';

interface DataSourceIndicatorProps {
  dataSource: string;
  confidence: number;
  lastUpdated: string;
  isEnhancing?: boolean;
}

export function DataSourceIndicator({ 
  dataSource, 
  confidence, 
  lastUpdated, 
  isEnhancing 
}: DataSourceIndicatorProps) {
  const getSourceInfo = () => {
    switch (dataSource) {
      case 'static':
        return {
          icon: Database,
          color: 'text-gray-400',
          label: 'Static Data',
          description: 'Curated game database'
        };
      case 'rawg':
        return {
          icon: Zap,
          color: 'text-blue-400',
          label: 'RAWG Enhanced',
          description: 'Enhanced with RAWG API data'
        };
      case 'igdb':
        return {
          icon: Zap,
          color: 'text-purple-400',
          label: 'IGDB Enhanced',
          description: 'Enhanced with IGDB API data'
        };
      case 'user':
        return {
          icon: Users,
          color: 'text-green-400',
          label: 'Community Enhanced',
          description: 'Improved by community contributions'
        };
      case 'hybrid':
        return {
          icon: Layers,
          color: 'text-yellow-400',
          label: 'Multi-Source',
          description: 'Combined from multiple sources'
        };
      default:
        return {
          icon: Database,
          color: 'text-gray-400',
          label: 'Unknown',
          description: 'Unknown data source'
        };
    }
  };

  const sourceInfo = getSourceInfo();
  const IconComponent = sourceInfo.icon;
  const confidenceColor = confidence >= 0.8 ? 'text-green-400' : 
                         confidence >= 0.6 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex items-center gap-1">
        {isEnhancing ? (
          <Wifi className="w-3 h-3 text-blue-400 animate-pulse" />
        ) : (
          <IconComponent className={`w-3 h-3 ${sourceInfo.color}`} />
        )}
        <span className={sourceInfo.color}>{sourceInfo.label}</span>
      </div>
      
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${confidenceColor}`} />
        <span className="text-gray-400">
          {Math.round(confidence * 100)}%
        </span>
      </div>
      
      <span className="text-gray-500">
        {new Date(lastUpdated).toLocaleDateString()}
      </span>
    </div>
  );
}