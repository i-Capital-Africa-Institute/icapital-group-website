interface SectionSkeletonProps {
  className?: string;
  minHeight?: string;
}

const SectionSkeleton = ({
  className = "",
  minHeight = "min-h-[320px]",
}: SectionSkeletonProps) => (
  <div
    className={`animate-pulse bg-gray-50/80 ${minHeight} ${className}`}
    aria-hidden="true"
  />
);

export default SectionSkeleton;
