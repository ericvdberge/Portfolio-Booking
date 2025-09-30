'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useKeyboardNav } from '@/shared/hooks/useKeyboardNav';
import { useTranslations } from 'next-intl';

interface LightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  locationName: string | undefined;
}

export function Lightbox({ images, initialIndex, isOpen, onClose, locationName }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const t = useTranslations('imageCollage');

  // Update current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useKeyboardNav({
    isOpen,
    onPrev: handlePrevious,
    onNext: handleNext,
    onClose,
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/90 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Visually hidden title for screen readers */}
          <Dialog.Title className="sr-only">
            {locationName} photo {currentIndex + 1} of {images.length}
          </Dialog.Title>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            aria-label={t('closeViewer')}
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              aria-label={t('previousImage')}
            >
              <ChevronLeft className="h-8 w-8 text-white" />
            </button>
          )}

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative max-w-7xl max-h-full">
              <Image
                src={images[currentIndex]}
                alt={`${locationName} photo ${currentIndex + 1}`}
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              aria-label={t('nextImage')}
            >
              <ChevronRight className="h-8 w-8 text-white" />
            </button>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm z-10">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
