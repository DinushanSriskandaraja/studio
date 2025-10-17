'use client';

import Image from 'next/image';
import { Clock, Bus, Hourglass, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Day } from '@/types';

type ItineraryDisplayProps = {
  itinerary: Day[];
};

export function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {

  if (itinerary.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="font-headline text-3xl font-bold mb-4">No Itinerary Found</h2>
        <p className="text-muted-foreground">We couldn't generate a structured itinerary. Please try again with different preferences.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center">Your Custom Itinerary</h2>
      <div className="space-y-8">
        {itinerary.map((day, dayIndex) => (
          <Card key={dayIndex} className="rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl animate-fade-in">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-3 text-2xl font-headline">
                <Calendar className="w-6 h-6 text-primary"/>
                {day.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-6 p-6">
                {day.activities.map((activity, activityIndex) => (
                  <div key={activityIndex} className="pl-6 border-l-2 border-primary/30 relative">
                     <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                    <div className="flex items-center gap-2 text-primary font-bold ml-4">
                       <Clock className="w-5 h-5"/>
                       <h4 className="text-lg font-semibold">{activity.time}</h4>
                    </div>
                    <div className="pl-4 ml-4">
                      <Card className="mt-2 overflow-hidden shadow-sm bg-white rounded-lg">
                        <div className="md:flex">
                          <div className="w-full h-48 md:w-48 md:h-auto relative flex-shrink-0">
                            <Image 
                              src={`https://source.unsplash.com/400x400/?${activity.photoQuery}`}
                              alt={`Image of ${activity.place}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4 flex flex-col">
                            <h5 className="font-bold text-lg">{activity.place}</h5>
                            <p className="text-muted-foreground text-sm flex-grow mt-1">{activity.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
                              <Hourglass className="w-3 h-3"/> 
                              <span>{activity.duration}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                      {activity.transport && (
                        <div className="pl-4 mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <Bus className="w-4 h-4" /> 
                          <span>{activity.transport} to next location</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
