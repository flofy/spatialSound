import React from 'react';
import { Play, Pause, RotateCw, Music, Move, Volume2, Upload } from 'lucide-react';
import { MelodyKey } from '../types';
import { melodies } from '../data/melodies';

interface AudioControlsProps {
  isPlaying: boolean;
  autoRotate: boolean;
  speed: number;
  melody: MelodyKey;
  volume: number;
  useCustomAudio: boolean;
  customFileName: string;
  onTogglePlay: () => void;
  onAutoRotateChange: (value: boolean) => void;
  onSpeedChange: (value: number) => void;
  onMelodyChange: (value: MelodyKey) => void;
  onVolumeChange: (value: number) => void;
  onFileUpload: (file: File) => void;
  onUseCustomAudioChange: (value: boolean) => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  autoRotate,
  speed,
  melody,
  volume,
  useCustomAudio,
  customFileName,
  onTogglePlay,
  onAutoRotateChange,
  onSpeedChange,
  onMelodyChange,
  onVolumeChange,
  onFileUpload,
  onUseCustomAudioChange
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bouton Play/Pause */}
      <div className="flex justify-center">
        <button
          onClick={onTogglePlay}
          className={`px-8 py-4 rounded-full font-bold text-white transition-all transform hover:scale-105 shadow-lg ${
            isPlaying 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
              : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
          }`}
        >
          {isPlaying ? (
            <span className="flex items-center gap-2">
              <Pause size={24} />
              Arrêter
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Play size={24} />
              Démarrer
            </span>
          )}
        </button>
      </div>

      {/* Mode de contrôle */}
      <div className="bg-white/5 rounded-xl p-4">
        <label className="flex items-center justify-between text-white mb-3">
          <span className="flex items-center gap-2">
            <Move size={20} />
            Mode de contrôle
          </span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onAutoRotateChange(true)}
            className={`py-3 px-4 rounded-lg font-medium transition-all ${
              autoRotate
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <RotateCw size={16} className="inline mr-2" />
            Auto
          </button>
          <button
            onClick={() => onAutoRotateChange(false)}
            className={`py-3 px-4 rounded-lg font-medium transition-all ${
              !autoRotate
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Move size={16} className="inline mr-2" />
            Manuel
          </button>
        </div>
        {!autoRotate && (
          <p className="text-xs text-purple-300 mt-2 text-center">
            Glissez-déposez l'icône 🎵 pour positionner le son<br/>
            <span className="text-xs text-blue-300">💡 Le volume varie selon la distance du centre</span>
          </p>
        )}
      </div>

      {/* Vitesse de rotation */}
      {autoRotate && (
        <div className="bg-white/5 rounded-xl p-4">
          <label className="flex items-center justify-between text-white mb-2">
            <span className="flex items-center gap-2">
              <RotateCw size={20} />
              Vitesse de rotation
            </span>
            <span className="font-mono">{speed.toFixed(1)}x</span>
          </label>
          <input
            type="range"
            min="0.2"
            max="3"
            step="0.1"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {/* Source audio */}
      <div className="bg-white/5 rounded-xl p-4">
        <label className="flex items-center gap-2 text-white mb-3">
          <Music size={20} />
          <span>Source audio</span>
        </label>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => onUseCustomAudioChange(false)}
            disabled={isPlaying}
            className={`py-2 px-4 rounded-lg font-medium transition-all ${
              !useCustomAudio
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Mélodies
          </button>
          <button
            onClick={() => onUseCustomAudioChange(true)}
            disabled={isPlaying || !customFileName}
            className={`py-2 px-4 rounded-lg font-medium transition-all ${
              useCustomAudio
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            } ${isPlaying || !customFileName ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Mon audio
          </button>
        </div>

        {!useCustomAudio ? (
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(melodies).map(([key, val]) => (
              <button
                key={key}
                onClick={() => onMelodyChange(key as MelodyKey)}
                disabled={isPlaying}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  melody === key
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {val.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-3 text-white/70">
            {customFileName || 'Fichier audio personnalisé'}
          </div>
        )}
        
        <div className="mt-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            disabled={isPlaying}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isPlaying}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              isPlaying
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Upload size={16} />
            Charger un fichier audio
          </button>
        </div>
        
        {isPlaying && (
          <p className="text-xs text-purple-300 mt-2 text-center">
            Arrêtez la lecture pour changer de source audio
          </p>
        )}
      </div>

      {/* Volume */}
      <div className="bg-white/5 rounded-xl p-4">
        <label className="flex items-center justify-between text-white mb-2">
          <span className="flex items-center gap-2">
            <Volume2 size={20} />
            Volume
          </span>
          <span className="font-mono">{Math.round((volume + 30) * 100 / 30)}%</span>
        </label>
        <input
          type="range"
          min="-30"
          max="0"
          step="1"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default AudioControls;