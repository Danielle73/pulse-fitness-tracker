export type Activity = {
  id: number;
  icon: string;
  name: string;
  date: string;
  duration: number;
  calories: number;
};

export type ActivityOption = {
  name: string;
  icon: string;
  caloriesPerMinute: number;
};