interface ImageCounterProps {
  current: number;
  total: number;
  className?: string;
}

export function ImageCounter({ current, total, className = '' }: ImageCounterProps) {
  if (total <= 1) return null;

  return (
    <div className={`bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium ${className}`}>
      {current} / {total}
    </div>
  );
}
