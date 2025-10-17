'use client';
import { Compass } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="relative mb-6">
        <Compass className="h-16 w-16 text-primary animate-spin-slow" />
      </div>
      <h2 className="font-headline text-3xl font-bold mb-4">Crafting Your Perfect Adventure...</h2>
      <p className="text-muted-foreground max-w-md">
        Our AI is analyzing your preferences to build a personalized trip. This may take a moment.
      </p>
    </div>
  );
}
