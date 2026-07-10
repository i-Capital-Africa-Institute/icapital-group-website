"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const rawMapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim() || "";
const mapboxToken =
  rawMapboxToken &&
  !/your_mapbox_token|changeme|placeholder|xxx/i.test(rawMapboxToken)
    ? rawMapboxToken
    : "";

if (mapboxToken) {
  mapboxgl.accessToken = mapboxToken;
}

interface MapLocation {
  lng: number;
  lat: number;
  address: string;
  title: string;
  plusCode?: string;
}

interface MapComponentProps {
  className?: string;
  initialLocation?: MapLocation;
  zoom?: number;
  showNavigationControl?: boolean;
  showPopup?: boolean;
  style?: string;
  interactive?: boolean;
  onMapLoad?: (map: mapboxgl.Map) => void;
  onMarkerClick?: (location: MapLocation) => void;
}

const DEFAULT_LOCATION: MapLocation = {
  lng: 38.7593536,
  lat: 9.0353134,
  address: "#604, Arada Sub-City, Arat-Killo, Addis Ababa",
  title: "The i-Capital Africa Institute",
  plusCode: "2QP5+4P",
};

const MapComponent = ({
  className = "",
  initialLocation = DEFAULT_LOCATION,
  zoom = 14,
  showNavigationControl = true,
  showPopup = true,
  style = "mapbox://styles/mapbox/streets-v12",
  interactive = true,
  onMapLoad,
  onMarkerClick,
}: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const createPopupContent = useCallback((location: MapLocation) => {
    return `
      <div class="p-3 max-w-xs">
        <h3 class="font-semibold text-[#1F3758] text-base mb-2">${location.title}</h3>
        <p class="text-sm text-gray-600 mb-1">${location.address}</p>
        ${location.plusCode ? `<p class="text-xs text-gray-500 mt-2">Plus Code: ${location.plusCode}</p>` : ''}
        <div class="mt-3">
          <a 
            href="https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Get Directions
          </a>
        </div>
      </div>
    `;
  }, []);

  const initializeMap = useCallback(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      setIsLoading(true);
      setHasError(false);

      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style,
        center: [initialLocation.lng, initialLocation.lat],
        zoom,
        interactive,
        attributionControl: true,
        customAttribution: "© i-Capital Africa Institute",
      });

      // Add navigation controls if enabled
      if (showNavigationControl) {
        mapInstance.addControl(new mapboxgl.NavigationControl({
          visualizePitch: true,
        }), "top-right");
      }

      // Add scale control
      mapInstance.addControl(new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
      }), 'bottom-left');

      // Wait for map to load before adding marker
      mapInstance.on('load', () => {
        setIsMapLoaded(true);
        setIsLoading(false);
        
        // Create marker with custom styling
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.innerHTML = `
          <div class="w-8 h-8 bg-[#FF6B00] rounded-full border-2 border-white shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform cursor-pointer">
            <div class="w-3 h-3 bg-white rounded-full"></div>
          </div>
        `;

        marker.current = new mapboxgl.Marker({
          element: markerElement,
          anchor: 'center',
        })
          .setLngLat([initialLocation.lng, initialLocation.lat])
          .addTo(mapInstance);

        // Add popup if enabled
        if (showPopup) {
          popup.current = new mapboxgl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            className: 'custom-popup',
          }).setHTML(createPopupContent(initialLocation));

          marker.current.setPopup(popup.current);

          // Handle marker click
          markerElement.addEventListener('click', (e) => {
            e.stopPropagation();
            onMarkerClick?.(initialLocation);
            if (popup.current?.isOpen()) {
              popup.current.remove();
            } else if (popup.current) {
              popup.current.addTo(mapInstance);
            }
          });
        }

        // Add keyboard navigation
        mapInstance.keyboard.enable();

        // Enable touch gestures for mobile
        mapInstance.touchZoomRotate.enable();

        // Call onMapLoad callback if provided
        onMapLoad?.(mapInstance);
      });

      // Handle map errors
      mapInstance.on('error', (e) => {
        console.error('Mapbox error:', e);
        setHasError(true);
        setIsLoading(false);
      });

      map.current = mapInstance;

    } catch (error) {
      console.error('Failed to initialize map:', error);
      setHasError(true);
      setIsLoading(false);
    }
  }, [mapboxToken, initialLocation, zoom, style, interactive, showNavigationControl, showPopup, createPopupContent, onMarkerClick, onMapLoad]);

  useEffect(() => {
    if (!mapboxToken) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      if (popup.current) {
        popup.current.remove();
        popup.current = null;
      }
    };
  }, [initializeMap, mapboxToken]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (map.current) {
        map.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!map.current || !isMapLoaded) return;
      
      switch(e.key) {
        case '+':
        case '=':
          map.current.zoomIn();
          break;
        case '-':
        case '_':
          map.current.zoomOut();
          break;
        case 'Escape':
          popup.current?.remove();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMapLoaded]);

  if (hasError) {
    return (
      <div 
        className={`h-full w-full rounded-lg bg-gray-100 flex items-center justify-center ${className}`}
        role="alert"
        aria-live="polite"
      >
        <div className="text-center p-6">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium mb-1">Map unavailable</p>
          <p className="text-sm text-gray-500">Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full rounded-lg overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00] mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      <div
        ref={mapContainer}
        className="h-full w-full"
        role="application"
        aria-label="Interactive map showing i-Capital Africa Institute location"
        tabIndex={0}
      />
      
      {isMapLoaded && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-2 text-xs text-gray-600">
          <div>Use +/- to zoom</div>
          <div>Click marker for details</div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
