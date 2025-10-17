'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PreferenceIcons } from './icons';

const preferences = [
  'culture',
  'food',
  'temples',
  'nature',
  'nightlife',
  'adventure',
] as const;

export const ItineraryFormSchema = z.object({
  destination: z.string().min(2, {
    message: 'Destination must be at least 2 characters.',
  }),
  dates: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }),
  preferences: z.array(z.enum(preferences)),
});

type ItineraryFormProps = {
  onSubmit: (data: z.infer<typeof ItineraryFormSchema>) => void;
  isLoading: boolean;
};

export function ItineraryForm({ onSubmit, isLoading }: ItineraryFormProps) {
  const form = useForm<z.infer<typeof ItineraryFormSchema>>({
    resolver: zodResolver(ItineraryFormSchema),
    defaultValues: {
      destination: '',
      dates: { from: undefined, to: undefined },
      preferences: [],
    },
  });

  const togglePreference = (preference: typeof preferences[number]) => {
    const currentPreferences = form.getValues('preferences');
    const newPreferences = currentPreferences.includes(preference)
      ? currentPreferences.filter((p) => p !== preference)
      : [...currentPreferences, preference];
    form.setValue('preferences', newPreferences, { shouldValidate: true });
  };

  const selectedPreferences = form.watch('preferences');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Paris, France" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dates"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Travel Dates</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value.from && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, 'LLL dd, y')} -{' '}
                              {format(field.value.to, 'LLL dd, y')}
                            </>
                          ) : (
                            format(field.value.from, 'LLL dd, y')
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={field.value.from}
                      selected={field.value as DateRange}
                      onSelect={field.onChange}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="preferences"
          render={() => (
            <FormItem>
              <FormLabel>Preferences</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {preferences.map((preference) => {
                    const Icon = PreferenceIcons[preference];
                    return (
                      <Button
                        key={preference}
                        type="button"
                        variant={selectedPreferences.includes(preference) ? 'default' : 'outline'}
                        onClick={() => togglePreference(preference)}
                        className="flex flex-col h-24 gap-2"
                      >
                        <Icon className="h-8 w-8" />
                        <span className="capitalize">{preference}</span>
                      </Button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full" size="lg" variant="accent">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Itinerary'
          )}
        </Button>
      </form>
    </Form>
  );
}
