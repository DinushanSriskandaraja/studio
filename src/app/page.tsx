'use client';

import type { z } from 'zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


import { ItineraryForm, type ItineraryFormSchema } from '@/components/itinerary/itinerary-form';
import { PageHeader } from '@/components/itinerary/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const router = useRouter();
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero');

  const handleFormSubmit = async (data: z.infer<typeof ItineraryFormSchema>) => {
    const params = new URLSearchParams();
    params.set('destination', data.destination);
    if (data.dates.from) params.set('from', data.dates.from.toISOString());
    if (data.dates.to) params.set('to', data.dates.to.toISOString());
    params.set('preferences', data.preferences.join(','));
    params.set('dayStartTime', data.dayStartTime);
    params.set('dayEndTime', data.dayEndTime);
    params.set('maxTravelTime', data.maxTravelTime.toString());

    router.push(`/itinerary?${params.toString()}`);
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
              Tell us your travel dreams, and our AI will weave the perfect itinerary for you.
            </p>
          </section>

          <Card className="mb-12 shadow-lg rounded-2xl">
            <CardContent className="p-6 md:p-8">
              <ItineraryForm onSubmit={handleFormSubmit} isLoading={false} />
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="text-center py-6 text-muted-foreground text-sm">
        <p>Powered by AI magic ✨</p>
      </footer>
    </div>
  );
}
