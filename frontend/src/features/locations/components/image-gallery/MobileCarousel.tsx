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
  minHeight?: string;
}

export function MobileCarousel({
  images,
  locationName,
  onImageClick,
  showDots = true,
  showCounter = true,
  showSwipeHint = true,
  minHeight = 'min-h-[300px]',
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
      {/* Carousel Container */}
      <div
        className={`relative overflow-hidden rounded-lg h-[50vh] ${minHeight} bg-gray-100`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Images */}
        <div
          className="flex transition-transform duration-300 ease-out h-full w-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div
              key={`mobile-${index}-${image}`}
              className="min-w-full h-full relative cursor-pointer flex-shrink-0"
              onClick={() => onImageClick(currentIndex)}
            >
              <Image
                src={image}
                alt={`${locationName} photo ${index + 1}`}
                width={1600}
                height={900}
                priority={index === 0}
                className="w-full h-full object-cover"
                style={{ objectFit: 'cover' }}
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
