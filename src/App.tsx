import { useEffect, useState } from "react";
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
import { getStoredData, saveData } from "./utils/storage";

export function App() {
  const [range, setRange] = useState<Range>("This week");
  const [section, setSection] = useState<Section>("Overview");
  // const [activities, setActivities] = useState<ActivityType[]>(initialActivities);

//   const [activities, setActivities] = useState<ActivityType[]>(() => {
//   const savedActivities = localStorage.getItem("activities");

//   if (!savedActivities) {
//     return initialActivities;
//   }

//   try {
//     return JSON.parse(savedActivities) as ActivityType[];
//   } catch {
//     return initialActivities;
//   }
// });

const [activities, setActivities] = useState<ActivityType[]>(() =>
  getStoredData<ActivityType[]>("activities", initialActivities),
);

// useEffect(() => {
//   localStorage.setItem("activities", JSON.stringify(activities));
// }, [activities]);

useEffect(() => {
  saveData("activities", activities);
}, [activities]);

  // const [stepEntries, setStepEntries] = useState<StepEntry[]>([]);

//   const [stepEntries, setStepEntries] = useState<StepEntry[]>(() => {
//   const savedEntries = localStorage.getItem("stepEntries");

//   if (!savedEntries) {
//     return [];
//   }

//   try {
//     return JSON.parse(savedEntries) as StepEntry[];
//   } catch {
//     return [];
//   }
// });

const [stepEntries, setStepEntries] = useState<StepEntry[]>(() =>
  getStoredData<StepEntry[]>("stepEntries", []),
);

// useEffect(() => {
//   localStorage.setItem("stepEntries", JSON.stringify(stepEntries));
// }, [stepEntries]);

useEffect(() => {
  saveData("stepEntries", stepEntries);
}, [stepEntries]);


  function saveSteps(date: string, steps: number) {
    setStepEntries((currentEntries) => {
      const existingEntry = currentEntries.find((entry) => entry.date === date);

      if (existingEntry) {
        return currentEntries.map((entry) =>
          entry.date === date ? { ...entry, steps } : entry,
        );
      }

      return [...currentEntries, { date, steps }];
    });
  }

  const data = ranges[range];
  const totalSteps = stepEntries
    .filter((entry) => isActivityInRange(entry.date, range))
    .reduce((total, entry) => total + entry.steps, 0);
  const filteredActivities = activities.filter((activity) =>
    isActivityInRange(activity.createdAt, range),
  );

  const displayedMinutes = filteredActivities.reduce(
    (sum, activity) => sum + activity.duration,
    0,
  );

  const displayedCalories = filteredActivities.reduce(
    (sum, activity) => sum + activity.calories,
    0,
  );

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
              steps={totalSteps.toLocaleString("en-GB")}
              minutes={displayedMinutes}
              calories={displayedCalories}
              activeDays={activeDays}
              activeDaysMessage={activeDaysMessage}
              range={range}
              goal={data.goal}
              values={data.values}
            />

            <StepTracker onSaveSteps={saveSteps} />

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
