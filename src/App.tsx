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
import { isActivityInRange } from "./utils/formatters";
import { getActiveDaysMessage } from "./utils/dashboardHelpers";
import AppHeader from "./components/layout/AppHeader";
import type { Section } from "./types/navigation";
import type { StepEntry } from "./types/steps";
import StepTracker from "./components/dashboard/StepTracker";

export function App() {
  const [range, setRange] = useState<Range>("This week");
  const [section, setSection] = useState<Section>("Overview");
  const [activities, setActivities] =
    useState<ActivityType[]>(initialActivities);

  const [stepEntries, setStepEntries] = useState<StepEntry[]>([]);
  const data = ranges[range];
  const filteredActivities = activities.filter((activity) =>
    isActivityInRange(activity.createdAt, range),
  );

  // const addedMinutes = activities
  //   .slice(0, -3)
  //   .reduce((sum, activity) => sum + activity.duration, 0);
  // const displayedMinutes = parseMinutes(data.minutes) + addedMinutes;

  const displayedMinutes = filteredActivities.reduce(
    (sum, activity) => sum + activity.duration,
    0,
  );

  // const displayedCalories =
  //   3240 +
  //   activities
  //     .slice(0, -3)
  //     .reduce((sum, activity) => sum + activity.calories, 0);

  const displayedCalories = filteredActivities.reduce(
    (sum, activity) => sum + activity.calories,
    0,
  );

  // const data = ranges[range];
  // const filteredActivities = activities.filter((activity) =>
  //   isActivityInRange(activity.createdAt, range),
  // );

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
        createdAt: new Date().toISOString(),
        duration: minutes,
        calories: minutes * selectedActivity.caloriesPerMinute,
      },
      ...current,
    ]);
  }

  function deleteActivity(id: number) {
    setActivities((currentActivities) =>
      currentActivities.filter((activity) => activity.id !== id),
    );
  }

  function updateActivity(updatedActivity: ActivityType) {
    setActivities((currentActivities) =>
      currentActivities.map((activity) =>
        activity.id === updatedActivity.id ? updatedActivity : activity,
      ),
    );
  }

  const activeDays = new Set(
    filteredActivities.map((activity) =>
      new Date(activity.createdAt).toDateString(),
    ),
  ).size;
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

            <StepTracker />

            <RecentActivity
              activities={filteredActivities}
              activityOptions={activityOptions}
              onAddActivity={addActivity}
              onDeleteActivity={deleteActivity}
              onUpdateActivity={updateActivity}
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
