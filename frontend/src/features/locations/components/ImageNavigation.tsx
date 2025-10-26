'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ImageNavigationProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrevious: () => void;
}

export function ImageNavigation({ currentPage, totalPages, onNext, onPrevious }: ImageNavigationProps) {
  const t = useTranslations('imageCollage');

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      <button
        onClick={onPrevious}
        disabled={currentPage === 0}
        className="p-2 rounded-full bg-default-100 hover:bg-default-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={t('previousImage')}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <span className="text-sm text-muted-foreground">
        {currentPage + 1} / {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages - 1}
        className="p-2 rounded-full bg-default-100 hover:bg-default-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={t('nextImage')}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
