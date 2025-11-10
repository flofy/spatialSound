import { useState, useEffect } from 'react';
import { Position } from '../types';

interface UseDragControlProps {
  autoRotate: boolean;
  onPositionUpdate: (position: Position) => void;
}

export const useDragControl = ({ autoRotate, onPositionUpdate }: UseDragControlProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    if (!autoRotate) {
      setIsDragging(true);
    }
  };

  const handleTouchStart = () => {
    if (!autoRotate) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent, svgElement: SVGSVGElement | null) => {
    if (!isDragging || autoRotate || !svgElement) return;
    
    const rect = svgElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = 160;
    const centerY = 160;
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= 120) {
      onPositionUpdate({ x, y });
    }
  };

  const handleTouchMove = (e: TouchEvent, svgElement: SVGSVGElement | null) => {
    if (!isDragging || autoRotate || !svgElement) return;
    
    e.preventDefault(); // Empêche le scroll pendant le drag
    
    const touch = e.touches[0];
    const rect = svgElement.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const centerX = 160;
    const centerY = 160;
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= 120) {
      onPositionUpdate({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      const mouseMoveHandler = () => {
        // Ce handler sera configuré dans le composant avec la référence SVG
      };

      window.addEventListener('mousemove', mouseMoveHandler);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging]);

  return {
    isDragging,
    handleMouseDown,
    handleTouchStart,
    handleMouseMove,
    handleTouchMove,
    handleMouseUp,
    handleTouchEnd
  };
};