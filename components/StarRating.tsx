type Props = { value: number; outOf?: number; className?: string };

export default function StarRating({ value, outOf = 5, className = "" }: Props) {
  return (
    <div className={`inline-flex items-center gap-1 ${className}`} aria-label={`${value} out of ${outOf}`}>
      {Array.from({ length: outOf }).map((_, i) => {
        const filled = i < value;
        return (
          <svg
            key={i}
            width="18" height="18" viewBox="0 0 24 24"
            className={filled ? "fill-yellow-400 stroke-yellow-400" : "fill-none stroke-slate-300"}
          >
            <path d="M12 3.5l2.9 5.88 6.5.95-4.7 4.58 1.1 6.49L12 18.9 6.2 21.4l1.1-6.49-4.7-4.58 6.5-.95L12 3.5z" />
          </svg>
        );
      })}
    </div>
  );
}
