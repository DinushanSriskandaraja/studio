'use client';

import { MountainSnow } from 'lucide-react';

export function PageHeader() {
  return (
    <header className="py-4 px-4 md:px-6 bg-card border-b">
      <div className="container mx-auto flex items-center gap-2">
        <MountainSnow className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold font-headline text-foreground">
          Tip2Trip
        </h1>
      </div>
    </header>
  );
}
