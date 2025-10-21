'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DotIndicators } from './DotIndicators';
import { ImageCounter } from './ImageCounter';
import { SwipeHint } from './SwipeHint';

interface MobileCarouselProps {
  images: string[];
  locationName: string | undefined;
  onImageClick: (index: number) => void;
  showDots?: boolean;
  showCounter?: boolean;
  showSwipeHint?: boolean;
}

export function MobileCarousel({
  images,
  locationName,
  onImageClick,
  showDots = true,
  showCounter = true,
  showSwipeHint = true,
}: MobileCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const minSwipeDistance = 50;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrevious();
    }
  };

  return (
    <div className="relative">
      {/* Carousel Container - Fixed viewport */}
      <div
        className="relative overflow-hidden rounded-lg h-[60vh] max-h-[600px] bg-gray-100"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Sliding Track - Expands to fit all slides */}
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div
              key={`mobile-${index}-${image}`}
              className="relative flex-shrink-0 min-w-full w-full h-full cursor-pointer"
              onClick={() => onImageClick(index)}
            >
              <Image
                src={image}
                alt={`${locationName} photo ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {/* Image Counter Badge */}
        {showCounter && (
          <ImageCounter
            current={currentIndex + 1}
            total={images.length}
            className="absolute top-4 right-4"
          />
        )}
      </div>

      {/* Dot Indicators */}
      {showDots && (
        <DotIndicators
          total={images.length}
          currentIndex={currentIndex}
          onDotClick={handleDotClick}
          className="mt-4"
        />
      )}

      {/* Swipe Hint */}
      {showSwipeHint && (
        <SwipeHint show={images.length > 1} className="mt-2" />
      )}
    </div>
  );
}
