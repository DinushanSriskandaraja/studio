'use server';

/**
 * @fileOverview Summarizes user reviews for a given attraction.
 *
 * - summarizeUserReviews - A function that takes an attraction name and reviews and returns a summary of the reviews.
 * - SummarizeUserReviewsInput - The input type for the summarizeUserReviews function.
 * - SummarizeUserReviewsOutput - The return type for the summarizeUserReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeUserReviewsInputSchema = z.object({
  attractionName: z.string().describe('The name of the attraction.'),
  reviews: z.array(z.string()).describe('An array of user reviews for the attraction.'),
});
export type SummarizeUserReviewsInput = z.infer<typeof SummarizeUserReviewsInputSchema>;

const SummarizeUserReviewsOutputSchema = z.object({
  summary: z.string().describe('A summary of the user reviews.'),
});
export type SummarizeUserReviewsOutput = z.infer<typeof SummarizeUserReviewsOutputSchema>;

export async function summarizeUserReviews(
  input: SummarizeUserReviewsInput
): Promise<SummarizeUserReviewsOutput> {
  return summarizeUserReviewsFlow(input);
}

const summarizeUserReviewsPrompt = ai.definePrompt({
  name: 'summarizeUserReviewsPrompt',
  input: {schema: SummarizeUserReviewsInputSchema},
  output: {schema: SummarizeUserReviewsOutputSchema},
  prompt: `Summarize the following user reviews for {{attractionName}}:\n\n{{#each reviews}}\n- {{{this}}}\n{{/each}}\n\nProvide a concise summary of the general sentiment expressed in the reviews.`,
});

const summarizeUserReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeUserReviewsFlow',
    inputSchema: SummarizeUserReviewsInputSchema,
    outputSchema: SummarizeUserReviewsOutputSchema,
  },
  async input => {
    const {output} = await summarizeUserReviewsPrompt(input);
    return output!;
  }
);
