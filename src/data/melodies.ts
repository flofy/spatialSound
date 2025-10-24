import { AudioTrack, MelodyKey } from '../types';

export const melodies: Record<MelodyKey, AudioTrack> = {
  naive: {
    name: "Naive Melody",
    type: 'melody',
    notes: ['C4', 'E4', 'G4', 'C5', 'E5', 'G4', 'F4', 'C4'],
    durations: ['4n', '4n', '4n', '2n', '4n', '4n', '2n', '2n'],
    drums: ['C1', '', 'C1', '', 'C1', '', 'C1', ''],
    drumDurations: ['4n', '4n', '4n', '4n', '4n', '4n', '4n', '4n'],
    tempo: 85
  },
  son3d: {
    name: "Son 3D",
    type: 'audio',
    audioUrl: '/audio/son-3d.mp3'
  }
};