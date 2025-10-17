'use server';

import { z } from 'zod';
import { generateItineraryFromPrompt } from '@/ai/flows/generate-itinerary-from-prompt';
import { differenceInDays, parseISO } from 'date-fns';
import { Day } from '@/types';

// Helper function to parse the AI's markdown response
const parseItinerary = (text: string): Day[] => {
  const days: Day[] = [];
  const dayBlocks = text.split('## ').filter(s => s.trim() !== '');

  dayBlocks.forEach(dayBlock => {
    const lines = dayBlock.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return;

    const dayTitle = lines.shift()!.trim();
    const day: Day = {
      title: dayTitle,
      activities: [],
    };

    const activityRegex = /\* (\d{2}:\d{2}) - ([^:]+): (.*) \(~(.+?)\) \[(.+?)\](?: \((.+?)\))?/;
    
    lines.forEach(line => {
        const match = line.match(activityRegex);
        if (match) {
            const [_, time, place, description, duration, photoQuery, transport] = match;
            day.activities.push({
                time: time.trim(),
                place: place.trim(),
                description: description.trim(),
                duration: duration.trim(),
                photoQuery: photoQuery.trim(),
                transport: transport ? transport.trim() : null
            });
        }
    });

    if (day.activities.length > 0) {
      days.push(day);
    }
  });

  return days;
};

// Redefine the schema here for server-side validation
const GetItinerarySchema = z.object({
  destination: z.string(),
  from: z.string().transform((str) => parseISO(str)),
  to: z.string().transform((str) => parseISO(str)),
  preferences: z.string().transform((str) => str.split(',').filter(p => p)),
  dayStartTime: z.string(),
  dayEndTime: z.string(),
});


export async function getItinerary(values: z.infer<typeof GetItinerarySchema>) {
  try {
    const validatedValues = GetItinerarySchema.parse(values);
    const { destination, from: fromDate, to: toDate, preferences, dayStartTime, dayEndTime } = validatedValues;
    
    const tripLength = differenceInDays(toDate, fromDate) + 1;
    if (tripLength <= 0) {
      return { error: 'End date must be after start date.' };
    }
    
    if (tripLength > 14) {
      return { error: 'Trips longer than 14 days are not supported yet.' };
    }

    const preferencesText = preferences.length > 0 ? `with a focus on: ${preferences.join(', ')}.` : 'for a general-interest trip.';

    const prompt = `
      Create a detailed, day-by-day travel itinerary for a ${tripLength}-day trip to ${destination}.
      The user's preferences are ${preferencesText}
      The user wants to start their day around ${dayStartTime} and end around ${dayEndTime}.
      
      Please structure the output STRICTLY as follows for each day:
      - Use markdown heading 2 for the day's title (e.g., "## Day 1: Arrival and Exploration").
      - Do NOT use heading 3 or any other heading levels.
      - Each activity MUST be a single bullet point on a new line.
      - Each bullet point MUST follow this EXACT format:
      * HH:mm - Place Name: One-sentence description. (~<spending time>) [<photo query>] (<transportation time>)

      Here are the rules for each part of the format:
      - HH:mm: The start time for the activity in 24-hour format.
      - Place Name: The name of the location or activity.
      - Description: A brief, engaging one-sentence description.
      - (~<spending time>): Estimated time to spend at the location (e.g., ~1-2 hours). MUST be in parentheses with a tilde.
      - [<photo query>]: A 1-2 word Unsplash query for the location (e.g., [Eiffel Tower]). This should be a simple term that will find a good image. MUST be in square brackets.
      - (<transportation time>): Estimated travel time from the PREVIOUS location (e.g., 20 min drive). This part is optional and should be omitted for the first activity of the day. MUST be in parentheses.

      Example of a correct bullet point:
      * 09:00 - Louvre Museum: Explore world-famous art, including the Mona Lisa. (~3-4 hours) [Louvre Museum]
      * 13:30 - Jardin des Tuileries: Stroll through the beautiful gardens next to the Louvre. (~1 hour) [Tuileries Garden] (10 min walk)
      
      Additional Instructions:
      - Group attractions that are geographically close to each other to minimize travel time.
      - Provide logical flow and realistic timings, respecting the daily start/end times.
      - Do not add ANY introductory or concluding text, notes, or summaries. Only output the structured itinerary.
    `;

    const result = await generateItineraryFromPrompt({ prompt });

    if (!result.itinerary) {
      return { error: 'The AI could not generate an itinerary based on your request. Please try again with different preferences.' };
    }

    const parsedItinerary = parseItinerary(result.itinerary);
    
    return { itinerary: parsedItinerary };

  } catch (error) {
    console.error("Itinerary generation failed:", error);
    if (error instanceof z.ZodError) {
      return { error: 'Invalid data provided. Please check your inputs.' };
    }
    return { error: 'An unexpected error occurred while generating your itinerary. Please try again later.' };
  }
}
