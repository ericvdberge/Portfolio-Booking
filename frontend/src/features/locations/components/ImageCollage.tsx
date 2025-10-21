'use client';

import { useState } from 'react';
import { Lightbox } from '@/shared/components/Lightbox';
import { MobileCarousel, DesktopImageGrid } from './image-gallery';

interface ImageCollageProps {
  images: string[];
  locationName: string | undefined;
  // Configuration options
  mobileConfig?: {
    showDots?: boolean;
    showCounter?: boolean;
    showSwipeHint?: boolean;
  };
  desktopConfig?: {
    imagesPerPage?: number;
  };
}

export function ImageCollage({
  images,
  locationName,
  mobileConfig = {},
  desktopConfig = {},
}: ImageCollageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div>
      {/* Mobile Carousel View */}
      <div className="md:hidden">
        <MobileCarousel
          images={images}
          locationName={locationName}
          onImageClick={handleImageClick}
          showDots={mobileConfig.showDots ?? true}
          showCounter={mobileConfig.showCounter ?? true}
          showSwipeHint={mobileConfig.showSwipeHint ?? true}
        />
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:block">
        <DesktopImageGrid
          images={images}
          locationName={locationName}
          onImageClick={handleImageClick}
          imagesPerPage={desktopConfig.imagesPerPage ?? 6}
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
