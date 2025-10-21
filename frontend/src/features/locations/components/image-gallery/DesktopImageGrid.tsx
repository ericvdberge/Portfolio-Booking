'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageNavigation } from '../ImageNavigation';

export type GridLayout = 'single' | 'double' | 'triple' | 'hero';

interface DesktopImageGridProps {
  images: string[];
  locationName: string | undefined;
  onImageClick: (index: number) => void;
  imagesPerPage?: number;
  minHeight?: string;
}

export function DesktopImageGrid({
  images,
  locationName,
  onImageClick,
  imagesPerPage = 6,
  minHeight = 'min-h-[400px] md:min-h-[500px]',
}: DesktopImageGridProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(images.length / imagesPerPage);
  const startIndex = currentPage * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const visibleImages = images.slice(startIndex, endIndex);

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

  // Determine layout based on number of visible images
  const getLayoutClass = (count: number): string => {
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
  const getImageClass = (index: number, count: number): string => {
    if (count === 3) {
      // 3 images: first image spans 3 columns and 2 rows (hero)
      if (index === 0) {
        return 'col-span-3 row-span-2';
      }
      // Remaining 2 images stack in the last 2 columns
      return 'col-span-2';
    }
    if (count >= 4) {
      // 4+ images: first image (hero) spans 3 columns and 2 rows
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
      <div className={`grid gap-2 ${minHeight} ${getLayoutClass(visibleImages.length)}`}>
        {visibleImages.map((image, index) => (
          <div
            key={`${startIndex + index}-${image}`}
            className={`relative overflow-hidden rounded-lg cursor-pointer group h-full ${getImageClass(
              index,
              visibleImages.length
            )}`}
            onClick={() => onImageClick(startIndex + index)}
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
  );
}
