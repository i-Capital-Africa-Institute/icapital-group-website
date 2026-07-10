"use client";

import dynamic from "next/dynamic";
import { useInView } from "framer-motion";
import { useRef } from "react";

const rawToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim() || "";
const hasValidMapboxToken =
  Boolean(rawToken) &&
  !/your_mapbox_token|changeme|placeholder|xxx/i.test(rawToken);

const MapComponent = dynamic(() => import("@/components/Map/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-100">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
    </div>
  ),
});

interface LazyMapProps {
  className?: string;
}

const MapUnavailable = ({ className = "" }: { className?: string }) => (
  <div
    className={`flex h-full w-full items-center justify-center bg-gray-100 ${className}`}
    role="img"
    aria-label="Map unavailable"
  >
    <div className="px-6 text-center">
      <p className="font-medium text-gray-700">Map unavailable</p>
      <p className="mt-1 text-sm text-gray-500">
        Add a valid Mapbox token to enable the map
      </p>
      <a
        href="https://maps.app.goo.gl/zCmZ9LmY2EMySmS29"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm font-semibold text-orange-500 hover:text-orange-600"
      >
        Open in Google Maps →
      </a>
    </div>
  </div>
);

const LazyMap = ({ className = "" }: LazyMapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "200px 0px" });

  if (!hasValidMapboxToken) {
    return <MapUnavailable className={className} />;
  }

  return (
    <div ref={ref} className={`h-full w-full ${className}`}>
      {isInView ? (
        <MapComponent className="h-full w-full" />
      ) : (
        <div
          className="h-full w-full animate-pulse bg-gray-100"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default LazyMap;
