'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Lightbox } from '@/shared/components/Lightbox';
import { ImageNavigation } from './ImageNavigation';

interface ImageCollageProps {
  images: string[];
  locationName: string | undefined;
}

export function ImageCollage({ images, locationName }: ImageCollageProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const imagesPerPage = 6;
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const startIndex = currentPage * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const visibleImages = images.slice(startIndex, endIndex);

  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50;

  const handleImageClick = (index: number) => {
    setLightboxIndex(startIndex + index);
    setLightboxOpen(true);
  };

  const handleMobileImageClick = () => {
    setLightboxIndex(currentMobileIndex);
    setLightboxOpen(true);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleMobileNext = () => {
    setCurrentMobileIndex((prev) => (prev + 1) % images.length);
  };

  const handleMobilePrevious = () => {
    setCurrentMobileIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentMobileIndex(index);
  };

  // Touch handlers for swipe gestures on mobile
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
      handleMobileNext();
    }
    if (isRightSwipe) {
      handleMobilePrevious();
    }
  };

  // Determine layout based on number of visible images
  const getLayoutClass = (count: number) => {
    switch (count) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-5 grid-rows-2';
      default:
        // 4+ images: 5 columns (hero takes 3, right stack takes 2)
        return 'grid-cols-5 grid-rows-2';
    }
  };

  // Get image-specific classes for different layouts
  const getImageClass = (index: number, count: number) => {
    if (count === 3) {
      // 3 images: first image spans 3 columns and 2 rows (hero)
      if (index === 0) {
        return 'col-span-3 row-span-2';
      }
      // Remaining 2 images stack in the last 2 columns
      return 'col-span-2';
    }
    if (count >= 4) {
      // 4+ images: first image (hero) spans 3 columns and 2 rows, remaining 2 stack in last 2 columns
      if (index === 0) {
        return 'col-span-3 row-span-2';
      }
      // Only show first 3 images in the initial grid view
      if (index > 2) {
        return 'hidden';
      }
      return 'col-span-2';
    }
    return '';
  };

  return (
    <div>
      {/* Mobile Carousel View */}
      <div className="md:hidden relative">
        <div
          className="relative overflow-hidden rounded-lg min-h-[400px] bg-gray-100"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Images */}
          <div
            className="flex transition-transform duration-300 ease-out h-full"
            style={{ transform: `translateX(-${currentMobileIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div
                key={`mobile-${index}-${image}`}
                className="min-w-full h-full relative cursor-pointer"
                onClick={handleMobileImageClick}
              >
                <Image
                  src={image}
                  alt={`${locationName} photo ${index + 1}`}
                  width={1600}
                  height={900}
                  priority={index === 0}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Image Counter Badge */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentMobileIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all rounded-full ${
                  index === currentMobileIndex
                    ? 'w-8 h-2 bg-blue-600'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Swipe Hint */}
        {images.length > 1 && (
          <div className="text-center mt-2 text-sm text-gray-500">
            Swipe to see more photos
          </div>
        )}
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:block">
        <div className={`grid gap-2 min-h-[400px] md:min-h-[500px] ${getLayoutClass(visibleImages.length)}`}>
          {visibleImages.map((image, index) => (
            <div
              key={`${startIndex + index}-${image}`}
              className={`relative overflow-hidden rounded-lg cursor-pointer group h-full ${getImageClass(index, visibleImages.length)}`}
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={image}
                alt={`${locationName} photo ${startIndex + index + 1}`}
                width={1600}
                height={900}
                priority={index === 0 && currentPage === 0}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
        </div>

        {/* Navigation for pagination */}
        <ImageNavigation
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={handleNextPage}
          onPrevious={handlePreviousPage}
        />
      </div>

      {/* Lightbox */}
      <Lightbox
        images={images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        locationName={locationName}
      />
    </div>
  );
}
