'use client';

import Image from 'next/image';
import { Clock, Bus, Hourglass } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
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
      <h2 className="font-headline text-3xl font-bold mb-6 text-center">Your Custom Itinerary</h2>
      <Accordion type="single" collapsible defaultValue="day-0" className="w-full space-y-4">
        {itinerary.map((day, dayIndex) => (
          <AccordionItem key={dayIndex} value={`day-${dayIndex}`} className="border-b-0">
             <Card className="rounded-2xl shadow-md overflow-hidden">
                <AccordionTrigger className="text-xl font-headline p-6 hover:no-underline bg-card">
                  {day.title}
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <div className="space-y-4 p-6">
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex}>
                        <div className="flex items-center gap-2 text-primary font-bold">
                           <Clock className="w-5 h-5"/>
                           <h4 className="text-lg">{activity.time}</h4>
                        </div>
                        <div className="pl-7">
                          <Card className="mt-2 overflow-hidden">
                            <div className="flex">
                              <div className="w-32 h-32 md:w-40 md:h-40 relative flex-shrink-0">
                                <Image 
                                  src={`https://source.unsplash.com/400x400/?${activity.photoQuery}`}
                                  alt={`Image of ${activity.place}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="p-4 flex flex-col">
                                <h5 className="font-bold text-lg">{activity.place}</h5>
                                <p className="text-muted-foreground text-sm flex-grow">{activity.description}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                  <Hourglass className="w-3 h-3"/> 
                                  <span>{activity.duration}</span>
                                </div>
                              </div>
                            </div>
                          </Card>
                          {activity.transport && (
                            <div className="pl-4 mt-2 flex items-center gap-2 text-sm text-muted-foreground">
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
