'use client';

import { useState } from 'react';
import type { z } from 'zod';
import Image from 'next/image';

import { getItinerary } from '@/lib/actions';
import { ItineraryForm, type ItineraryFormSchema } from '@/components/itinerary/itinerary-form';
import { ItineraryDisplay } from '@/components/itinerary/itinerary-display';
import { PageHeader } from '@/components/itinerary/page-header';
import { MapView } from '@/components/itinerary/map-view';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Location } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [mapCenter, setMapCenter] = useState<Location | null>(null);
  const { toast } = useToast();

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero');

  const parseLocationsFromItinerary = (text: string): string[] => {
    const activityRegex = /^\* ([^*:]+):/gm;
    const matches = text.matchAll(activityRegex);
    const uniqueLocations = new Set<string>();
    for (const match of matches) {
      uniqueLocations.add(match[1].trim());
    }
    return Array.from(uniqueLocations);
  };

  const geocodeLocations = async (locations: string[], city: string): Promise<Location[]> => {
    const geocoded: Location[] = [];
    for (const location of locations) {
      try {
        const query = `${location}, ${city}`;
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
        if (!res.ok) continue;
        const data = await res.json();
        if (data && data.length > 0) {
          geocoded.push({
            name: location,
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          });
        }
      } catch (error) {
        console.error(`Geocoding failed for ${location}:`, error);
      }
    }
    return geocoded;
  };

  const handleFormSubmit = async (data: z.infer<typeof ItineraryFormSchema>) => {
    setIsLoading(true);
    setItinerary(null);
    setLocations([]);
    setMapCenter(null);

    try {
      const result = await getItinerary(data);
      if (result.error || !result.itinerary) {
        throw new Error(result.error || 'Failed to generate itinerary.');
      }
      setItinerary(result.itinerary);

      const parsedLocs = parseLocationsFromItinerary(result.itinerary);
      const geocodedLocs = await geocodeLocations(parsedLocs, data.destination);
      
      if (geocodedLocs.length > 0) {
        setLocations(geocodedLocs);
        setMapCenter(geocodedLocs[0]);
      } else {
        // Fallback to geocoding the destination city itself
        const cityGeocoded = await geocodeLocations([data.destination], data.destination);
        if (cityGeocoded.length > 0) {
          setMapCenter(cityGeocoded[0]);
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="text-center mb-12">
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-2xl mb-6">
              {heroImage && (
                 <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    data-ai-hint={heroImage.imageHint}
                    fill
                    className="object-cover"
                    priority
                />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h1 className="font-headline text-4xl md:text-6xl font-bold text-white shadow-md">
                  Craft Your Next Adventure
                </h1>
              </div>
            </div>
            <p className="text-muted-foreground text-lg">
              Tell us your travel dreams, and our AI will weave the perfect itinerary for you.
            </p>
          </section>

          <Card className="mb-12 shadow-lg">
            <CardContent className="p-6">
              <ItineraryForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </CardContent>
          </Card>

          {isLoading && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="font-headline text-3xl font-bold mb-4">Generating your trip...</h2>
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              </div>
              <div>
                <Skeleton className="h-[500px] w-full rounded-lg" />
              </div>
            </div>
          )}

          {itinerary && (
            <div className="grid md:grid-cols-2 gap-8">
              <ItineraryDisplay itinerary={itinerary} />
              <div className="md:sticky md:top-8 h-[500px] md:h-[calc(100vh-4rem)]">
                 <MapView center={mapCenter} locations={locations} />
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-4 text-muted-foreground text-sm">
        <p>Powered by AI magic ✨</p>
      </footer>
    </div>
  );
}
