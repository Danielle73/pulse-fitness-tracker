import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Overview from "./pages/Overview";
import type { Activity as ActivityType } from "./types/activity";
import RecentActivity from "./components/dashboard/RecentActivity";
import Activity from "./pages/Activity";
import Wellness from "./pages/Wellness";
import Settings from "./pages/Settings";
import { initialActivities, activityOptions } from "./data/activityData";
import type { Range } from "./types/dashboard";
import { ranges } from "./data/dashboardData";
import { parseMinutes } from "./utils/formatters";
import { getActiveDaysMessage } from "./utils/dashboardHelpers";
import AppHeader from "./components/layout/AppHeader";
import type { Section } from "./types/navigation";

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
        <AppHeader section={section} range={range} onRangeChange={setRange} />

        {renderPage()}
      </main>
    </div>
  );
}
