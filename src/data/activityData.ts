import type { Activity as ActivityType, ActivityOption } from "../types/activity";

export const initialActivities: ActivityType[] = [
  {
    id: 1,
    icon: "🏃",
    name: "Morning run",
    date: "Today, 7:30 AM",
    duration: 32,
    calories: 384,
  },
  {
    id: 2,
    icon: "🚲",
    name: "Evening cycling",
    date: "Yesterday, 6:15 PM",
    duration: 45,
    calories: 410,
  },
  {
    id: 3,
    icon: "🏋",
    name: "Strength training",
    date: "Mon, 5:45 PM",
    duration: 38,
    calories: 265,
  },
];

export const activityOptions: ActivityOption[] = [
  { name: "Walking", icon: "🚶", caloriesPerMinute: 4 },
  { name: "Running", icon: "🏃", caloriesPerMinute: 12 },
  { name: "Cycling", icon: "🚲", caloriesPerMinute: 9 },
  { name: "Strength training", icon: "🏋", caloriesPerMinute: 7 },
  { name: "Swimming", icon: "🏊", caloriesPerMinute: 10 },
  { name: "Yoga", icon: "🧘", caloriesPerMinute: 3 },
];