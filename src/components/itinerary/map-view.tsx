'use client';

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Card } from '@/components/ui/card';
import type { Location } from '@/types';

type MapViewProps = {
  center: Location | null;
  locations: Location[];
};

export function MapView({ center, locations }: MapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <Card className="h-full w-full flex items-center justify-center p-4">
        <div className="text-center">
          <h3 className="font-bold">Map Unavailable</h3>
          <p className="text-muted-foreground text-sm">
            Google Maps API key is not configured.
          </p>
        </div>
      </Card>
    );
  }

  const defaultCenter = { lat: 51.5072, lng: -0.1276 }; // Default to London

  return (
    <Card className="h-full w-full overflow-hidden shadow-lg">
      <APIProvider apiKey={apiKey}>
        <Map
          mapId="tip2trip-map"
          defaultZoom={10}
          zoom={center ? 12 : 10}
          center={center ? { lat: center.lat, lng: center.lng } : defaultCenter}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          className="h-full w-full"
        >
          {locations.map((location, index) => (
            <AdvancedMarker key={index} position={location}>
               <div className="w-6 h-6 rounded-full bg-accent border-2 border-white shadow-md" title={location.name} />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </Card>
  );
}
