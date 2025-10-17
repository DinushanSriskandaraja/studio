'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { getItinerary } from '@/lib/actions';
import { ItineraryDisplay } from '@/components/itinerary/itinerary-display';
import { PageHeader } from '@/components/itinerary/page-header';
import { useToast } from '@/hooks/use-toast';
import type { Day } from '@/types';
import { Button } from '../ui/button';
import Link from 'next/link';
import { LoadingSpinner } from './loading-spinner';

function ItineraryGeneratorComponent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [itinerary, setItinerary] = useState<Day[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const destination = searchParams.get('destination');
    const from = searchParams.get('from');
    const to = search_params.get('to');
    const preferences = search_params.get('preferences') || '';
    const dayStartTime = search_params.get('dayStartTime');
    const dayEndTime = search_params.get('dayEndTime');
    const maxTravelTime = search_params.get('maxTravelTime');

    if (!destination || !from || !to || !dayStartTime || !dayEndTime || !maxTravelTime) {
      setError('Missing required information to generate an itinerary. Please go back and fill out the form.');
      setIsLoading(false);
      return;
    }

    const generate = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await getItinerary({
          destination,
          from,
          to,
          preferences,
          dayStartTime,
          dayEndTime,
          maxTravelTime
        });

        if (result.error || !result.itinerary) {
          throw new Error(result.error || 'Failed to generate itinerary.');
        }
        setItinerary(result.itinerary);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    generate();
  }, [searchParams, toast]);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {isLoading && <LoadingSpinner />}

          {error && !isLoading && (
             <div className="text-center py-10">
                <h2 className="font-headline text-3xl font-bold mb-4 text-destructive">Oops! Something went wrong.</h2>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button asChild>
                    <Link href="/">Try Again</Link>
                </Button>
            </div>
          )}

          {itinerary && !isLoading && <ItineraryDisplay itinerary={itinerary} />}
        </div>
      </main>
       <footer className="text-center py-6 text-muted-foreground text-sm">
         <p>Powered by AI magic ✨</p>
      </footer>
    </div>
  );
}

export function ItineraryGenerator() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ItineraryGeneratorComponent />
        </Suspense>
    )
}
