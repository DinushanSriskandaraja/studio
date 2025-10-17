'use client';

import { Suspense } from 'react';
import { ItineraryGenerator } from '@/components/itinerary/itinerary-generator';

export default function ItineraryPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ItineraryGenerator />
    </Suspense>
  );
}
