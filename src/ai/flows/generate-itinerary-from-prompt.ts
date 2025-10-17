'use server';
/**
 * @fileOverview A travel itinerary generation AI agent.
 *
 * - generateItineraryFromPrompt - A function that generates a travel itinerary from a prompt.
 * - GenerateItineraryInput - The input type for the generateItineraryFromPrompt function.
 * - GenerateItineraryOutput - The return type for the generateItineraryFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateItineraryInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the desired trip.'),
});
export type GenerateItineraryInput = z.infer<typeof GenerateItineraryInputSchema>;

const GenerateItineraryOutputSchema = z.object({
  itinerary: z.string().describe('A detailed travel itinerary generated from the prompt.'),
});
export type GenerateItineraryOutput = z.infer<typeof GenerateItineraryOutputSchema>;

export async function generateItineraryFromPrompt(input: GenerateItineraryInput): Promise<GenerateItineraryOutput> {
  return generateItineraryFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateItineraryFromPromptPrompt',
  input: {schema: GenerateItineraryInputSchema},
  output: {schema: GenerateItineraryOutputSchema},
  prompt: `You are a travel expert. Generate a detailed travel itinerary based on the following prompt:\n\nPrompt: {{{prompt}}}`,
});

const generateItineraryFromPromptFlow = ai.defineFlow(
  {
    name: 'generateItineraryFromPromptFlow',
    inputSchema: GenerateItineraryInputSchema,
    outputSchema: GenerateItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
