import { useRef, useEffect } from 'react';
import { Position } from '../types';

interface UseAutoRotationProps {
  isPlaying: boolean;
  autoRotate: boolean;
  speed: number;
  onPositionUpdate: (position: Position) => void;
}

export const useAutoRotation = ({
  isPlaying,
  autoRotate,
  speed,
  onPositionUpdate
}: UseAutoRotationProps) => {
  const animationRef = useRef<number | null>(null);

  const updateAutoRotation = () => {
    if (!autoRotate || !isPlaying) return;

    const centerX = 160;
    const centerY = 160;
    const radius = 100;
    const time = Date.now() * 0.001 * speed;
    
    const x = centerX + Math.cos(time) * radius;
    const y = centerY + Math.sin(time) * radius;
    
    onPositionUpdate({ x, y });
    
    animationRef.current = requestAnimationFrame(updateAutoRotation);
  };

  useEffect(() => {
    if (isPlaying && autoRotate) {
      animationRef.current = requestAnimationFrame(updateAutoRotation);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, autoRotate, speed]);

  return { animationRef };
};