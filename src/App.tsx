import { useEffect, useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Overview from "./pages/Overview";
import type { Activity as ActivityType } from "./types/activity";
import RecentActivity from "./components/dashboard/RecentActivity";
import Activity from "./pages/Activity";
import Wellness from "./pages/Wellness";
import Settings from "./pages/Settings";
import { activityOptions } from "./data/activityData";
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

  const [activities, setActivities] = useState<ActivityType[]>([]);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch("/api/activities");

        if (!response.ok) {
          throw new Error("Failed to fetch activities.");
        }

        const data: ActivityType[] = await response.json();

        setActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    }

    fetchActivities();
  }, []);

  const [stepEntries, setStepEntries] = useState<StepEntry[]>(() =>
    getStoredData<StepEntry[]>("stepEntries", []),
  );

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

  function deleteSteps(date: string) {
    setStepEntries((currentEntries) =>
      currentEntries.filter((entry) => entry.date !== date),
    );
  }

  const data = ranges[range];

  const totalSteps = stepEntries
    .filter((entry) => isActivityInRange(entry.date, range))
    .reduce((total, entry) => total + entry.steps, 0);

  const today = new Date();

  const daysSinceMonday = (today.getDay() + 6) % 7;

  const monday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - daysSinceMonday,
  );

  const weeklySteps = Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + index);

    const dateString = [
      currentDate.getFullYear(),
      String(currentDate.getMonth() + 1).padStart(2, "0"),
      String(currentDate.getDate()).padStart(2, "0"),
    ].join("-");

    const entry = stepEntries.find((entry) => entry.date === dateString);

    return (entry?.steps ?? 0) / 1000;
  });

  // Get the number of days in the current month
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();

  // Calculate step totals for five 7-day periods
  const monthlySteps = Array.from({ length: 5 }, (_, index) => {
    const startDay = index * 7 + 1;
    const endDay = Math.min(startDay + 6, daysInMonth);

    const total = stepEntries
      .filter((entry) => {
        const [year, month, day] = entry.date.split("-").map(Number);

        return (
          year === today.getFullYear() &&
          month === today.getMonth() + 1 &&
          day >= startDay &&
          day <= endDay
        );
      })
      .reduce((total, entry) => total + entry.steps, 0);

    return total / 1000;
  });

  // Labels for the monthly chart
  const monthlyLabels = ["1–7", "8–14", "15–21", "22–28", "29–31"];

  const yearlySteps = Array.from({ length: 12 }, (_, index) => {
    const total = stepEntries
      .filter((entry) => {
        const [year, month] = entry.date.split("-").map(Number);

        return year === today.getFullYear() && month === index + 1;
      })
      .reduce((total, entry) => total + entry.steps, 0);

    return total / 1000;
  });

  const yearlyLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartValues =
    range === "This week"
      ? weeklySteps
      : range === "This month"
        ? monthlySteps
        : yearlySteps;

  const chartLabels =
    range === "This week"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : range === "This month"
        ? monthlyLabels
        : yearlyLabels;

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

  async function addActivity(activityType: string, minutes: number) {
    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: activityType,
          duration: minutes,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create activity.");
      }

      const newActivity: ActivityType = await response.json();
      setActivities((currentActivities) => [newActivity, ...currentActivities]);
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  }

  async function deleteActivity(id: number) {
    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete activity.");
      }
      setActivities((currentActivities) =>
        currentActivities.filter((activity) => activity.id !== id),
      );
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
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
              activities={filteredActivities}
              steps={totalSteps.toLocaleString("en-GB")}
              minutes={displayedMinutes}
              calories={displayedCalories}
              activeDays={activeDays}
              activeDaysMessage={activeDaysMessage}
              range={range}
              goal={data.goal}
              values={chartValues}
              labels={chartLabels}
            />

            <StepTracker
              stepEntries={stepEntries}
              onSaveSteps={saveSteps}
              onDeleteSteps={deleteSteps}
            />

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
            onDeleteActivity={deleteActivity}
            onUpdateActivity={updateActivity}
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
