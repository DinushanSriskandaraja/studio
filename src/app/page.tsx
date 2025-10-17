'use client';

import { useState } from 'react';
import type { z } from 'zod';
import Image from 'next/image';

import { getItinerary } from '@/lib/actions';
import { ItineraryForm, type ItineraryFormSchema } from '@/components/itinerary/itinerary-form';
import { ItineraryDisplay } from '@/components/itinerary/itinerary-display';
import { PageHeader } from '@/components/itinerary/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Day } from '@/types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Day[] | null>(null);
  const { toast } = useToast();

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero');

  const handleFormSubmit = async (data: z.infer<typeof ItineraryFormSchema>) => {
    setIsLoading(true);
    setItinerary(null);
    
    try {
      const result = await getItinerary(data);
      if (result.error || !result.itinerary) {
        throw new Error(result.error || 'Failed to generate itinerary.');
      }
      setItinerary(result.itinerary);

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
    <div className="flex flex-col min-h-screen">
      <PageHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="text-center mb-12">
            <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl mb-6">
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
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tell us your travel dreams, and our AI will weave the perfect itinerary for you, complete with stunning photos, timings, and travel estimates.
            </p>
          </section>

          <Card className="mb-12 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <ItineraryForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </CardContent>
          </Card>

          {isLoading && (
            <div>
              <h2 className="font-headline text-3xl font-bold mb-6">Generating your trip...</h2>
              <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-8 w-1/3" />
                    <div className="flex gap-4">
                        <Skeleton className="h-24 w-24 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                     <div className="flex gap-4">
                        <Skeleton className="h-24 w-24 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {itinerary && <ItineraryDisplay itinerary={itinerary} />}
        </div>
      </main>
      <footer className="text-center py-6 text-muted-foreground text-sm">
        <p>Powered by AI magic ✨</p>
      </footer>
    </div>
  );
}
