export type Activity = {
  time: string;
  place: string;
  description: string;
  duration: string;
  photoQuery: string;
  transport: string | null;
};

export type Day = {
  title: string;
  activities: Activity[];
};
