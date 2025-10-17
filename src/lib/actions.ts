'use server';

import { z } from 'zod';
import { generateItineraryFromPrompt } from '@/ai/flows/generate-itinerary-from-prompt';
import { ItineraryFormSchema } from '@/components/itinerary/itinerary-form';
import { differenceInDays } from 'date-fns';

export async function getItinerary(values: z.infer<typeof ItineraryFormSchema>) {
  try {
    const { destination, dates, preferences } = values;

    if (!dates.from || !dates.to) {
      return { error: 'Please select a valid date range.' };
    }

    const tripLength = differenceInDays(dates.to, dates.from) + 1;
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
      
      Please structure the output as follows for each day:
      - Use markdown heading 2 for the day (e.g., "## Day 1: Arrival and Exploration").
      - Use markdown heading 3 for parts of the day (e.g., "### Morning", "### Afternoon", "### Evening").
      - For each activity, use a bullet point starting with the place name, followed by a colon and a brief, engaging one-sentence description. Example: "* Eiffel Tower: Get a bird's-eye view of Paris from this iconic landmark."
      - Group attractions that are geographically close to each other to minimize travel time.
      - Prioritize cultural or nature activities in the morning/afternoon, and food or nightlife in the evening.
      - Provide logical flow and realistic timings. Do not include travel times in the output.
      - Do not add any introductory or concluding text outside of the day-by-day itinerary structure.
    `;

    const result = await generateItineraryFromPrompt({ prompt });

    if (!result.itinerary) {
      return { error: 'The AI could not generate an itinerary based on your request. Please try again with different preferences.' };
    }

    return { itinerary: result.itinerary };
  } catch (error) {
    console.error("Itinerary generation failed:", error);
    return { error: 'An unexpected error occurred while generating your itinerary. Please try again later.' };
  }
}
