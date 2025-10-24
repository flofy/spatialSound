import { useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { Position } from '../types';

export const useSpatialAudio = (volume: number) => {
  const pannerRef = useRef<Tone.Panner3D | null>(null);
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const drumRef = useRef<Tone.MembraneSynth | null>(null);
  const patternRef = useRef<Tone.Pattern<string> | null>(null);
  const drumPatternRef = useRef<Tone.Pattern<string> | null>(null);
  const playerRef = useRef<Tone.Player | null>(null);

  useEffect(() => {
    // Effets simples
    const reverb = new Tone.Reverb({
      decay: 2,
      wet: 0.2
    }).toDestination();

    // Synthétiseur principal
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.3,
        decay: 0.4,
        sustain: 0.3,
        release: 1.2
      },
      volume: volume
    });

    // Percussions
    drumRef.current = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 10,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0.01,
        release: 1.4,
        attackCurve: 'exponential'
      },
      volume: volume - 5
    });
    
    pannerRef.current = new Tone.Panner3D({
      panningModel: 'HRTF',
      distanceModel: 'linear',
      refDistance: 1,
      maxDistance: 10,
      rolloffFactor: 1
    });
    
    playerRef.current = new Tone.Player({
      loop: true,
      volume: volume
    });
    
    // Connexions audio
    synthRef.current.connect(pannerRef.current);
    drumRef.current.connect(pannerRef.current);
    playerRef.current.connect(pannerRef.current);
    pannerRef.current.connect(reverb);

    return () => {
      if (synthRef.current) synthRef.current.dispose();
      if (drumRef.current) drumRef.current.dispose();
      if (pannerRef.current) pannerRef.current.dispose();
      if (playerRef.current) playerRef.current.dispose();
      if (reverb) reverb.dispose();
    };
  }, []);

  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.volume.value = volume;
    }
    if (drumRef.current) {
      drumRef.current.volume.value = volume - 5;
    }
    if (playerRef.current) {
      playerRef.current.volume.value = volume;
    }
  }, [volume]);

  const updatePannerPosition = (position: Position) => {
    if (!pannerRef.current) return 0;
    
    const centerX = 160;
    const centerY = 160;
    const dx = position.x - centerX;
    const dy = position.y - centerY;
    
    const angle = Math.atan2(dy, dx);
    const distance = Math.sqrt(dx * dx + dy * dy) / 40;
    
    const radius = Math.min(distance, 5);
    const posX = Math.cos(angle) * radius;
    const posZ = Math.sin(angle) * radius;
    
    pannerRef.current.positionX.value = posX;
    pannerRef.current.positionY.value = 0;
    pannerRef.current.positionZ.value = posZ;
    
    // Retourner la distance pour le calcul du volume
    return distance;
  };

  const updateVolumeByDistance = (baseVolume: number, distance: number, isManualMode: boolean) => {
    if (!isManualMode) return;
    
    // Distance normalisée (0 = centre, 3 = bord du cercle)
    const normalizedDistance = Math.min(distance, 3);
    
    // Calcul du volume : plus proche = plus fort
    // Formule : volume diminue exponentiellement avec la distance
    const distanceVolume = baseVolume + (normalizedDistance * -8); // -8dB par unité de distance
    const finalVolume = Math.max(distanceVolume, baseVolume - 24); // Limite à -24dB de réduction max
    
    if (synthRef.current) {
      synthRef.current.volume.rampTo(finalVolume, 0.1);
    }
    if (drumRef.current) {
      drumRef.current.volume.rampTo(finalVolume - 5, 0.1);
    }
    if (playerRef.current) {
      playerRef.current.volume.rampTo(finalVolume, 0.1);
    }
  };

  return {
    synthRef,
    drumRef,
    patternRef,
    drumPatternRef,
    playerRef,
    updatePannerPosition,
    updateVolumeByDistance
  };
};