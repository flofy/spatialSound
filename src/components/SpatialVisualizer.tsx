import React from 'react';
import { Position } from '../types';

interface SpatialVisualizerProps {
  position: Position;
  isPlaying: boolean;
  autoRotate: boolean;
  isDragging: boolean;
  onMouseDown: () => void;
  onTouchStart: () => void;
  svgRef: React.RefObject<SVGSVGElement>;
}

const SpatialVisualizer: React.FC<SpatialVisualizerProps> = ({
  position,
  isPlaying,
  autoRotate,
  isDragging,
  onMouseDown,
  onTouchStart,
  svgRef
}) => {
  // Calculer la distance du centre pour l'effet visuel
  const centerX = 160;
  const centerY = 160;
  const dx = position.x - centerX;
  const dy = position.y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Calculer l'opacité basée sur la distance (plus proche = plus opaque)
  const maxDistance = 120; // Rayon du cercle
  const normalizedDistance = Math.min(distance / maxDistance, 1);
  const proximityOpacity = !autoRotate ? 1 - (normalizedDistance * 0.6) : 1; // Réduction max de 60%
  return (
    <div className="relative w-80 h-80 mx-auto mb-4 sm:mb-8 bg-black/20 rounded-full touch-none">
      <svg 
        ref={svgRef}
        width="320" 
        height="320" 
        className="absolute inset-0"
        style={{ cursor: !autoRotate ? 'crosshair' : 'default', touchAction: 'none' }}
      >
        <circle cx="160" cy="160" r="120" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="160" y1="40" x2="160" y2="280" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="40" y1="160" x2="280" y2="160" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        
        <circle cx="160" cy="160" r="15" fill="#fff" opacity="0.9" />
        <text x="160" y="165" textAnchor="middle" fill="#000" fontSize="12" fontWeight="bold">👤</text>
        
        {isPlaying && (
          <line 
            x1="160" 
            y1="160" 
            x2={position.x} 
            y2={position.y} 
            stroke="#10b981" 
            strokeWidth="2" 
            opacity="0.4"
            strokeDasharray="3,3"
          />
        )}
        
        <g 
          style={{ cursor: !autoRotate ? 'grab' : 'default' }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        >
          <circle 
            cx={position.x} 
            cy={position.y} 
            r={isPlaying ? "20" : "12"}
            fill={isPlaying ? "#10b981" : "#6366f1"}
            opacity={!autoRotate ? proximityOpacity * 0.3 : 0.3}
          >
            {isPlaying && (
              <animate 
                attributeName="r" 
                values="20;35;20"
                dur="2s" 
                repeatCount="indefinite" 
              />
            )}
          </circle>
          <circle 
            cx={position.x} 
            cy={position.y} 
            r="12" 
            fill={isPlaying ? "#10b981" : "#6366f1"}
            opacity={!autoRotate ? proximityOpacity : 1}
            style={{ cursor: !autoRotate ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          />
          <text 
            x={position.x} 
            y={position.y + 5} 
            textAnchor="middle" 
            fill="#fff" 
            fontSize="16"
            style={{ pointerEvents: 'none' }}
          >
            🎵
          </text>
        </g>
      </svg>
      
      {/* Indicateur d'intensité en mode manuel */}
      {!autoRotate && isPlaying && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-white/20">
          <div className="flex items-center gap-3 text-white">
            <span className="text-xl">🔊</span>
            <div className="flex flex-col gap-1">
              <div className="w-32 bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-150 shadow-lg"
                  style={{ width: `${proximityOpacity * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-300">
                <span>Loin</span>
                <span className="font-bold text-white">{Math.round(proximityOpacity * 100)}%</span>
                <span>Proche</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpatialVisualizer;