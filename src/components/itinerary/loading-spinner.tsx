'use client';
import { WorldMapIcon } from './world-map-icon';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="relative mb-6">
        <div className="relative h-24 w-48 overflow-hidden">
          <WorldMapIcon className="h-full w-full text-primary/30" />
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        </div>
      </div>
      <h2 className="font-headline text-3xl font-bold mb-4">Charting Your Course...</h2>
      <p className="text-muted-foreground max-w-md">
        Our AI is scanning the globe to build your personalized trip. This may take a moment.
      </p>
    </div>
  );
}
