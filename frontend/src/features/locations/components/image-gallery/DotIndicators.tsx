interface DotIndicatorsProps {
  total: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
  className?: string;
}

export function DotIndicators({ total, currentIndex, onDotClick, className = '' }: DotIndicatorsProps) {
  if (total <= 1) return null;

  return (
    <div className={`flex justify-center gap-2 ${className}`}>
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`transition-all rounded-full ${
            index === currentIndex
              ? 'w-8 h-2 bg-blue-600'
              : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
          }`}
          aria-label={`Go to image ${index + 1}`}
          aria-current={index === currentIndex ? 'true' : 'false'}
        />
      ))}
    </div>
  );
}
