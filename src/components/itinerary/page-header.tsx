'use client';

import { MountainSnow } from 'lucide-react';
import Link from 'next/link';

export function PageHeader() {
  return (
    <header className="py-4 px-4 md:px-6 bg-card border-b sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <MountainSnow className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold font-headline">
            Tip2Trips
          </h1>
        </Link>
      </div>
    </header>
  );
}
