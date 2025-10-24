import React from 'react';
import { Play, Pause, Volume2, RotateCw, Move } from 'lucide-react';
import { MelodyKey } from '../types';
import { melodies } from '../data/melodies';
import Accordion from './Accordion';

interface ConfigPanelProps {
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

const ConfigPanel: React.FC<ConfigPanelProps> = ({
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
    <div className="space-y-4">
      {/* Contrôles principaux - toujours visibles */}
      <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
        <div className="space-y-4">
          {/* Bouton Play/Pause */}
          <div className="flex justify-center">
            <button
              onClick={onTogglePlay}
              className={`px-6 py-3 rounded-lg font-bold text-white btn-hover shadow-lg ${
                isPlaying 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
              }`}
            >
              {isPlaying ? (
                <span className="flex items-center gap-2">
                  <Pause size={20} />
                  Arrêter
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Play size={20} />
                  Démarrer
                </span>
              )}
            </button>
          </div>

          {/* Mode de contrôle */}
          <div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onAutoRotateChange(true)}
                className={`py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                  autoRotate
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <RotateCw size={14} className="inline mr-1" />
                Auto
              </button>
              <button
                onClick={() => onAutoRotateChange(false)}
                className={`py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                  !autoRotate
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Move size={14} className="inline mr-1" />
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
        </div>
      </div>

      {/* Source Audio */}
      <Accordion title="Source Audio" icon="🎵" defaultOpen={false}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUseCustomAudioChange(false)}
              className={`py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                !useCustomAudio
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Mélodies
            </button>
            <button
              onClick={() => onUseCustomAudioChange(true)}
              disabled={!customFileName}
              className={`py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                useCustomAudio
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              } ${!customFileName ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Personnalisé
            </button>
          </div>

          {!useCustomAudio ? (
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(melodies).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => onMelodyChange(key as MelodyKey)}
                  className={`py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                    melody === key
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {val.name}
                  {isPlaying && melody === key && (
                    <span className="ml-2">🎵</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-2 text-white/70 text-sm">
              {customFileName || 'Aucun fichier sélectionné'}
            </div>
          )}
          
          <div>
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
              className="w-full py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm bg-white/10 text-white/70 hover:bg-white/20"
            >
              📁 Charger un fichier
            </button>
          </div>
        </div>
      </Accordion>

      {/* Paramètres */}
      <Accordion title="Paramètres" icon="⚙️" defaultOpen={false}>
        <div className="space-y-4">
          {/* Volume */}
          <div>
            <label className="flex items-center justify-between text-white mb-2 text-sm">
              <span className="flex items-center gap-2">
                <Volume2 size={16} />
                Volume
              </span>
              <span className="font-mono text-xs">{Math.round((volume + 30) * 100 / 30)}%</span>
            </label>
            <input
              type="range"
              min="-30"
              max="0"
              step="1"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          {/* Vitesse de rotation */}
          {autoRotate && (
            <div>
              <label className="flex items-center justify-between text-white mb-2 text-sm">
                <span className="flex items-center gap-2">
                  <RotateCw size={16} />
                  Vitesse
                </span>
                <span className="font-mono text-xs">{speed.toFixed(1)}x</span>
              </label>
              <input
                type="range"
                min="0.2"
                max="3"
                step="0.1"
                value={speed}
                onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          )}
        </div>
      </Accordion>

      {/* Informations */}
      <Accordion title="Informations" icon="ℹ️" defaultOpen={false}>
        <div className="space-y-3 text-sm text-purple-200">
          <div className="flex items-center gap-2">
            <span>🎧</span>
            <span>Utilisez des écouteurs pour une expérience optimale</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔄</span>
            <span>Mode auto : rotation automatique du son</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🎯</span>
            <span>Mode manuel : contrôle par glisser-déposer</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📏</span>
            <span>Distance du centre = intensité du volume</span>
          </div>
          {isPlaying && (
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span>État :</span>
                <span className="text-green-400 font-medium">🎵 En cours de lecture</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Mode :</span>
                <span className="text-blue-400 font-medium">
                  {autoRotate ? '🔄 Automatique' : '🎯 Manuel'}
                </span>
              </div>
            </div>
          )}
        </div>
      </Accordion>
    </div>
  );
};

export default ConfigPanel;