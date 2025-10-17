'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type ItineraryDisplayProps = {
  itinerary: string;
};

type Activity = {
  place: string;
  description: string;
};

type DayPart = {
  title: 'Morning' | 'Afternoon' | 'Evening';
  activities: Activity[];
};

type Day = {
  title: string;
  parts: DayPart[];
};

const parseItinerary = (text: string): Day[] => {
  const days: Day[] = [];
  const dayBlocks = text.split('## ').filter(Boolean);

  dayBlocks.forEach((dayBlock) => {
    const dayTitleMatch = dayBlock.match(/(.*)/);
    if (!dayTitleMatch) return;

    const day: Day = {
      title: dayTitleMatch[1].trim(),
      parts: [],
    };

    const partBlocks = dayBlock.split('### ').filter(Boolean);
    partBlocks.forEach((partBlock) => {
      const partTitleMatch = partBlock.match(/(Morning|Afternoon|Evening)/);
      if (!partTitleMatch) return;

      const part: DayPart = {
        title: partTitleMatch[0] as DayPart['title'],
        activities: [],
      };

      const activityMatches = partBlock.matchAll(/\* ([^:]+): (.*)/g);
      for (const match of activityMatches) {
        part.activities.push({
          place: match[1].trim(),
          description: match[2].trim(),
        });
      }

      if(part.activities.length > 0) {
        day.parts.push(part);
      }
    });

    if (day.parts.length > 0) {
      days.push(day);
    }
  });

  return days;
};

export function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  const parsedItinerary = parseItinerary(itinerary);

  if (parsedItinerary.length === 0) {
    return (
      <div>
        <h2 className="font-headline text-3xl font-bold mb-4">Your Itinerary</h2>
        <p className="text-muted-foreground">We couldn't generate a structured itinerary from the response. Please try again.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-headline text-3xl font-bold mb-4">Your Custom Itinerary</h2>
      <Accordion type="single" collapsible defaultValue="day-0" className="w-full">
        {parsedItinerary.map((day, dayIndex) => (
          <AccordionItem key={dayIndex} value={`day-${dayIndex}`}>
            <AccordionTrigger className="text-xl font-headline hover:no-underline">
              {day.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pl-2 border-l-2 border-primary/50 ml-2">
                {day.parts.map((part, partIndex) => (
                  <div key={partIndex} className="relative pl-6">
                     <div className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-primary" />
                    <h4 className="font-bold text-lg mb-2">{part.title}</h4>
                    <ul className="space-y-2 list-none">
                      {part.activities.map((activity, activityIndex) => (
                        <li key={activityIndex}>
                          <p className="font-semibold">{activity.place}</p>
                          <p className="text-muted-foreground">{activity.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
