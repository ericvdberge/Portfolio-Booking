import { useEffect } from 'react';

interface UseKeyboardNavProps {
  isOpen: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

/**
 * Custom hook for keyboard navigation in lightbox
 * Handles ArrowLeft (previous), ArrowRight (next), Escape (close)
 */
export function useKeyboardNav({ isOpen, onPrev, onNext, onClose }: UseKeyboardNavProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onPrev, onNext, onClose]);
}
