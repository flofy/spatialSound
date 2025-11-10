import React, { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { Position, MelodyKey } from '../types';
import { melodies } from '../data/melodies';
import { useSpatialAudio } from '../hooks/useSpatialAudio';
import { useAutoRotation } from '../hooks/useAutoRotation';
import { useDragControl } from '../hooks/useDragControl';
import SpatialVisualizer from './SpatialVisualizer';
import ConfigPanel from './ConfigPanel';

const RotatingSound: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [melody, setMelody] = useState<MelodyKey>('naive');
  const [autoRotate, setAutoRotate] = useState(true);
  const [position, setPosition] = useState<Position>({ x: 160, y: 60 });
  const [volume, setVolume] = useState(-8);
  const [useCustomAudio, setUseCustomAudio] = useState(false);
  const [customFileName, setCustomFileName] = useState('');
  
  const svgRef = useRef<SVGSVGElement>(null);

  const { synthRef, drumRef, patternRef, drumPatternRef, playerRef, updatePannerPosition, updateVolumeByDistance } = useSpatialAudio(volume);

  const handlePositionUpdate = (newPosition: Position) => {
    setPosition(newPosition);
    const distance = updatePannerPosition(newPosition);
    
    // Appliquer le volume dynamique uniquement en mode manuel
    if (distance !== undefined) {
      updateVolumeByDistance(volume, distance, !autoRotate);
    }
  };

  useAutoRotation({
    isPlaying,
    autoRotate,
    speed,
    onPositionUpdate: handlePositionUpdate
  });

  const { isDragging, handleMouseDown, handleTouchStart, handleMouseMove, handleTouchMove } = useDragControl({
    autoRotate,
    onPositionUpdate: handlePositionUpdate
  });

  // Configuration des gestionnaires de mouvement (souris et tactile) avec la référence SVG
  useEffect(() => {
    if (isDragging) {
      const mouseMoveHandler = (e: MouseEvent) => {
        handleMouseMove(e, svgRef.current);
      };

      const touchMoveHandler = (e: TouchEvent) => {
        handleTouchMove(e, svgRef.current);
      };

      window.addEventListener('mousemove', mouseMoveHandler);
      window.addEventListener('touchmove', touchMoveHandler, { passive: false });
      window.addEventListener('mouseup', () => {
        // Le handleMouseUp est géré dans le hook useDragControl
      });
      
      return () => {
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('touchmove', touchMoveHandler);
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove]);

  const togglePlay = async () => {
    if (!isPlaying) {
      await Tone.start();
      
      if (useCustomAudio && playerRef.current?.loaded) {
        playerRef.current.start();
      } else {
        const currentTrack = melodies[melody];
        
        if (currentTrack.type === 'audio' && currentTrack.audioUrl) {
          // Charger et jouer le fichier audio prédéfini
          try {
            if (playerRef.current) {
              await playerRef.current.load(currentTrack.audioUrl);
              playerRef.current.start();
            }
          } catch (error) {
            console.error('Erreur lors du chargement du fichier audio:', error);
            return;
          }
        } else if (currentTrack.type === 'melody' && currentTrack.notes && currentTrack.durations && currentTrack.tempo) {
          // Jouer la mélodie synthétisée avec drums
          Tone.Transport.bpm.value = currentTrack.tempo;
          
          let noteIndex = 0;
          patternRef.current = new Tone.Pattern((time: number, note: string) => {
            synthRef.current?.triggerAttackRelease(note, currentTrack.durations![noteIndex], time);
            noteIndex = (noteIndex + 1) % currentTrack.notes!.length;
          }, currentTrack.notes, 'up');
          
          // Ajouter les drums si disponibles
          if (currentTrack.drums && currentTrack.drumDurations) {
            let drumIndex = 0;
            drumPatternRef.current = new Tone.Pattern((time: number, drum: string) => {
              if (drum && drum !== '') { // Ne jouer que si ce n'est pas une note vide
                drumRef.current?.triggerAttackRelease(drum, currentTrack.drumDurations![drumIndex], time);
              }
              drumIndex = (drumIndex + 1) % currentTrack.drums!.length;
            }, currentTrack.drums, 'up');
            
            drumPatternRef.current.start(0);
          }
          
          patternRef.current.start(0);
          Tone.Transport.start();
        }
      }
      
      setIsPlaying(true);
      updatePannerPosition(position);
    } else {
      if (useCustomAudio) {
        playerRef.current?.stop();
      } else {
        const currentTrack = melodies[melody];
        if (currentTrack.type === 'audio') {
          playerRef.current?.stop();
        } else {
          if (patternRef.current) {
            patternRef.current.stop();
            patternRef.current.dispose();
          }
          if (drumPatternRef.current) {
            drumPatternRef.current.stop();
            drumPatternRef.current.dispose();
          }
          Tone.Transport.stop();
        }
      }
      setIsPlaying(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert('Veuillez sélectionner un fichier audio');
      return;
    }

    setCustomFileName(file.name);
    
    try {
      const url = URL.createObjectURL(file);
      if (playerRef.current) {
        await playerRef.current.load(url);
      }
      setUseCustomAudio(true);
    } catch (error) {
      console.error('Erreur lors du chargement du fichier:', error);
      alert('Erreur lors du chargement du fichier audio');
    }
  };

  const handleMelodyChange = (newMelody: MelodyKey) => {
    setMelody(newMelody);
    
    // Si on est en train de jouer, changer immédiatement la source
    if (isPlaying && !useCustomAudio) {
      changeTrackOnTheFly(newMelody);
    }
  };

  const handleUseCustomAudioChange = (value: boolean) => {
    if (value && !customFileName) {
      alert('Veuillez d\'abord charger un fichier audio');
      return;
    }
    setUseCustomAudio(value);
    
    // Si on est en train de jouer, changer immédiatement la source
    if (isPlaying) {
      if (value) {
        // Passer au fichier custom
        stopCurrentTrack();
        if (playerRef.current?.loaded) {
          playerRef.current.start();
        }
      } else {
        // Passer aux mélodies synthétisées
        changeTrackOnTheFly(melody);
      }
    }
  };

  const stopCurrentTrack = () => {
    // Arrêter tous les patterns existants
    if (patternRef.current) {
      patternRef.current.stop();
      patternRef.current.dispose();
      patternRef.current = null;
    }
    if (drumPatternRef.current) {
      drumPatternRef.current.stop();
      drumPatternRef.current.dispose();
      drumPatternRef.current = null;
    }
    // Arrêter le player audio
    if (playerRef.current?.state === 'started') {
      playerRef.current.stop();
    }
  };

  const changeTrackOnTheFly = async (newMelody: MelodyKey) => {
    const currentTrack = melodies[newMelody];
    
    // Arrêter la piste actuelle
    stopCurrentTrack();
    
    if (currentTrack.type === 'audio' && currentTrack.audioUrl) {
      // Charger et jouer le fichier audio
      try {
        if (playerRef.current) {
          await playerRef.current.load(currentTrack.audioUrl);
          playerRef.current.start();
        }
      } catch (error) {
        console.error('Erreur lors du chargement du fichier audio:', error);
      }
    } else if (currentTrack.type === 'melody' && currentTrack.notes && currentTrack.durations && currentTrack.tempo) {
      // Jouer la nouvelle mélodie
      Tone.Transport.bpm.value = currentTrack.tempo;
      
      let noteIndex = 0;
      patternRef.current = new Tone.Pattern((time: number, note: string) => {
        synthRef.current?.triggerAttackRelease(note, currentTrack.durations![noteIndex], time);
        noteIndex = (noteIndex + 1) % currentTrack.notes!.length;
      }, currentTrack.notes, 'up');
      
      // Ajouter les drums si disponibles
      if (currentTrack.drums && currentTrack.drumDurations) {
        let drumIndex = 0;
        drumPatternRef.current = new Tone.Pattern((time: number, drum: string) => {
          if (drum && drum !== '') {
            drumRef.current?.triggerAttackRelease(drum, currentTrack.drumDurations![drumIndex], time);
          }
          drumIndex = (drumIndex + 1) % currentTrack.drums!.length;
        }, currentTrack.drums, 'up');
        
        drumPatternRef.current.start(0);
      }
      
      patternRef.current.start(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-2 sm:p-4 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-4xl w-full shadow-2xl">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Son 3D Spatial</h1>
          <p className="text-purple-200 text-xs sm:text-sm">🎧 Expérience audio immersive en 3D</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 items-start">
          {/* Visualisation */}
          <div className="flex flex-col items-center">
            <SpatialVisualizer
              position={position}
              isPlaying={isPlaying}
              autoRotate={autoRotate}
              isDragging={isDragging}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              svgRef={svgRef}
            />
          </div>

          {/* Panneau de configuration */}
          <div className="space-y-4">
            <ConfigPanel
              isPlaying={isPlaying}
              autoRotate={autoRotate}
              speed={speed}
              melody={melody}
              volume={volume}
              useCustomAudio={useCustomAudio}
              customFileName={customFileName}
              onTogglePlay={togglePlay}
              onAutoRotateChange={setAutoRotate}
              onSpeedChange={setSpeed}
              onMelodyChange={handleMelodyChange}
              onVolumeChange={setVolume}
              onFileUpload={handleFileUpload}
              onUseCustomAudioChange={handleUseCustomAudioChange}
            />
          </div>
        </div>

        <div className="mt-6 text-center text-purple-200 text-xs">
          🌟 Utilisez l'audio spatial 3D pour une immersion totale
        </div>
      </div>
    </div>
  );
};

export default RotatingSound;