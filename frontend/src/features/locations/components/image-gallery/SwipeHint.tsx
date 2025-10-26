interface SwipeHintProps {
  show: boolean;
  className?: string;
}

export function SwipeHint({ show, className = '' }: SwipeHintProps) {
  if (!show) return null;

  return (
    <div className={`text-center text-sm text-default-500 ${className}`}>
      Swipe to see more photos
    </div>
  );
}
