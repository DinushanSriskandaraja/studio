'use client';
import { Globe } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="relative mb-6">
        <Globe className="h-16 w-16 text-primary animate-spin-slow" />
      </div>
      <h2 className="font-headline text-3xl font-bold mb-4">Charting Your Course...</h2>
      <p className="text-muted-foreground max-w-md">
        Our AI is scanning the globe to build your personalized trip. This may take a moment.
      </p>
    </div>
  );
}
