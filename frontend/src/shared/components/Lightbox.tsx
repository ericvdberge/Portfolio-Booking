'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Modal, ModalContent, Button } from '@heroui/react';
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      classNames={{
        base: "bg-black/90",
        body: "p-0",
        wrapper: "items-center justify-center",
      }}
      hideCloseButton
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            transition: {
              duration: 0.2,
            },
          },
          exit: {
            opacity: 0,
            transition: {
              duration: 0.2,
            },
          },
        },
      }}
    >
      <ModalContent>
        {() => (
          <>
            {/* Visually hidden title for screen readers */}
            <h2 className="sr-only">
              {locationName} photo {currentIndex + 1} of {images.length}
            </h2>

            {/* Close button */}
            <Button
              isIconOnly
              variant="light"
              onPress={onClose}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20"
              aria-label={t('closeViewer')}
            >
              <X className="h-6 w-6 text-white" />
            </Button>

            {/* Previous button */}
            {images.length > 1 && (
              <Button
                isIconOnly
                variant="light"
                onPress={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20"
                aria-label={t('previousImage')}
              >
                <ChevronLeft className="h-8 w-8 text-white" />
              </Button>
            )}

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
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
              <Button
                isIconOnly
                variant="light"
                onPress={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20"
                aria-label={t('nextImage')}
              >
                <ChevronRight className="h-8 w-8 text-white" />
              </Button>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm z-10">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
