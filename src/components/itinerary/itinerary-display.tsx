'use client';

import Image from 'next/image';
import { Clock, Bus, Hourglass } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import type { Day, Activity } from '@/types';

type ItineraryDisplayProps = {
  itinerary: Day[];
};

export function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {

  if (itinerary.length === 0) {
    return (
      <div>
        <h2 className="font-headline text-3xl font-bold mb-4">Your Itinerary</h2>
        <p className="text-muted-foreground">We couldn't generate a structured itinerary from the response. Please try again with different preferences.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center">Your Custom Itinerary</h2>
      <Accordion type="single" collapsible defaultValue="day-0" className="w-full space-y-6">
        {itinerary.map((day, dayIndex) => (
          <AccordionItem key={dayIndex} value={`day-${dayIndex}`} className="border-b-0">
             <Card className="rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
                <AccordionTrigger className="text-xl md:text-2xl font-headline p-6 hover:no-underline bg-card data-[state=open]:bg-muted/50">
                  {day.title}
                </AccordionTrigger>
                <AccordionContent className="p-0 bg-card">
                  <div className="space-y-6 p-6">
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="pl-4 border-l-4 border-primary/50 relative">
                         <div className="absolute -left-[11px] top-1.5 h-4 w-4 rounded-full bg-primary" />
                        <div className="flex items-center gap-2 text-primary font-bold ml-4">
                           <Clock className="w-5 h-5"/>
                           <h4 className="text-lg font-semibold">{activity.time}</h4>
                        </div>
                        <div className="pl-4 ml-4">
                          <Card className="mt-2 overflow-hidden shadow-sm">
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
                            <div className="pl-4 mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                              <Bus className="w-4 h-4" /> 
                              <span>{activity.transport} to next location</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
             </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
