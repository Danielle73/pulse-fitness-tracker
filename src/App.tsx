import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Overview from "./pages/Overview";
import type { Activity as ActivityType } from "./types/activity";
import RecentActivity from "./components/dashboard/RecentActivity";
import Activity from "./pages/Activity";
import Wellness from "./pages/Wellness";
import Settings from "./pages/Settings";
import { initialActivities, activityOptions } from "./data/activityData";

type Range = "This week" | "This month" | "This year";
type Section = "Overview" | "Activity" | "Wellness" | "Settings";

const ranges: Record<
  Range,
  { steps: string; minutes: string; goal: string; values: number[] }
> = {
  "This week": {
    steps: "58,160",
    minutes: "285",
    goal: "58,160 / 80,000 steps",
    values: [5.3, 8.7, 6.7, 10.2, 7.8, 9.6, 7.2],
  },
  "This month": {
    steps: "214,840",
    minutes: "1,120",
    goal: "214,840 / 320,000 steps",
    values: [7.6, 9.1, 8.4, 10.2, 8.9, 9.8, 11],
  },
  "This year": {
    steps: "1.24M",
    minutes: "6,840",
    goal: "1.24M / 1.8M steps",
    values: [8.2, 9.6, 8.9, 10.8, 9.5, 11.4, 10.1],
  },
};

// const initialActivities: ActivityType[] = [
//   {
//     id: 1,
//     icon: "🏃",
//     name: "Morning run",
//     date: "Today, 7:30 AM",
//     duration: 32,
//     calories: 384,
//   },
//   {
//     id: 2,
//     icon: "🚲",
//     name: "Evening cycling",
//     date: "Yesterday, 6:15 PM",
//     duration: 45,
//     calories: 410,
//   },
//   {
//     id: 3,
//     icon: "🏋",
//     name: "Strength training",
//     date: "Mon, 5:45 PM",
//     duration: 38,
//     calories: 265,
//   },
// ];

// const activityOptions: ActivityOption[] = [
//   { name: "Walking", icon: "🚶", caloriesPerMinute: 4 },
//   { name: "Running", icon: "🏃", caloriesPerMinute: 12 },
//   { name: "Cycling", icon: "🚲", caloriesPerMinute: 9 },
//   { name: "Strength training", icon: "🏋", caloriesPerMinute: 7 },
//   { name: "Swimming", icon: "🏊", caloriesPerMinute: 10 },
//   { name: "Yoga", icon: "🧘", caloriesPerMinute: 3 },
// ];

function parseMinutes(value: string) {
  return value.endsWith("M")
    ? Number(value.slice(0, -1)) * 1000000
    : Number(value.replace(",", ""));
}

function getActiveDaysMessage(days: number): string {
  if (days === 0) return "Let's get moving!";
  if (days === 1) return "Great start!";
  if (days <= 3) return "You're building momentum!";
  if (days <= 5) return "Great consistency!";
  if (days === 6) return "Almost there!";
  return "Weekly goal achieved!";
}

export function App() {
  const [range, setRange] = useState<Range>("This week");
  const [section, setSection] = useState<Section>("Overview");
  const [activities, setActivities] =
    useState<ActivityType[]>(initialActivities);
  const data = ranges[range];
  const addedMinutes = activities
    .slice(0, -3)
    .reduce((sum, activity) => sum + activity.duration, 0);
  const displayedMinutes = parseMinutes(data.minutes) + addedMinutes;
  const displayedCalories =
    3240 +
    activities
      .slice(0, -3)
      .reduce((sum, activity) => sum + activity.calories, 0);

  function addActivity(activityType: string, minutes: number) {
    const selectedActivity = activityOptions.find(
      (activity) => activity.name === activityType,
    );

    if (!selectedActivity) return;

    setActivities((current) => [
      {
        id: Date.now(),
        icon: selectedActivity.icon,
        name: selectedActivity.name,
        date: "Today, just now",
        duration: minutes,
        calories: minutes * selectedActivity.caloriesPerMinute,
      },
      ...current,
    ]);
  }

  const activeDays = Math.min(7, 5 + (addedMinutes > 0 ? 1 : 0));

  const activeDaysMessage = getActiveDaysMessage(activeDays);

  function renderPage() {
    switch (section) {
      case "Overview":
        return (
          <>
            <Overview
              steps={data.steps}
              minutes={displayedMinutes}
              calories={displayedCalories}
              activeDays={activeDays}
              activeDaysMessage={activeDaysMessage}
              range={range}
              goal={data.goal}
              values={data.values}
            />

            <RecentActivity
              activities={activities}
              activityOptions={activityOptions}
              onAddActivity={addActivity}
            />
          </>
        );

      case "Activity":
        return (
          <Activity
            activities={activities}
            activityOptions={activityOptions}
            onAddActivity={addActivity}
          />
        );

      case "Wellness":
        return <Wellness />;

      case "Settings":
        return <Settings />;

      default:
        return null;
    }
  }

  return (
    <div className="app">
      <Sidebar section={section} setSection={setSection} />
      <main>
        <header>
          <div>
            <p className="eyebrow">{section} · Tuesday, June 18, 2024</p>
            <h1>
              Good morning, Alex <span aria-hidden="true">👋</span>
            </h1>
          </div>
          <div className="header-actions">
            <label className="date-picker">
              Range{" "}
              <select
                value={range}
                onChange={(event) => setRange(event.target.value as Range)}
              >
                {Object.keys(ranges).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <div className="avatar">AS</div>
          </div>
        </header>
        {renderPage()}
      </main>
    </div>
  );
}
