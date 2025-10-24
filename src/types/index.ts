export interface Position {
  x: number;
  y: number;
}

export interface Melody {
  name: string;
  notes: string[];
  durations: string[];
  tempo: number;
}

export interface AudioTrack {
  name: string;
  type: 'melody' | 'audio';
  notes?: string[];
  durations?: string[];
  drums?: string[];
  drumDurations?: string[];
  tempo?: number;
  audioUrl?: string;
}

export type MelodyKey = 'naive' | 'son3d';

export interface AudioState {
  isPlaying: boolean;
  speed: number;
  melody: MelodyKey;
  autoRotate: boolean;
  position: Position;
  isDragging: boolean;
  volume: number;
  useCustomAudio: boolean;
  customFileName: string;
}