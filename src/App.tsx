import { useState } from "react";
import type { FormEvent } from "react";
import Sidebar from "./components/layout/Sidebar";
import Overview from "./pages/Overview";

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

type Activity = {
  id: number;
  icon: string;
  name: string;
  date: string;
  duration: number;
  calories: number;
};

const initialActivities: Activity[] = [
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

const activityOptions = [
  { name: "Walking", icon: "🚶", caloriesPerMinute: 4 },
  { name: "Running", icon: "🏃", caloriesPerMinute: 12 },
  { name: "Cycling", icon: "🚲", caloriesPerMinute: 9 },
  { name: "Strength training", icon: "🏋", caloriesPerMinute: 7 },
  { name: "Swimming", icon: "🏊", caloriesPerMinute: 10 },
  { name: "Yoga", icon: "🧘", caloriesPerMinute: 3 },
];

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
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [activityType, setActivityType] = useState(activityOptions[0].name);
  const [duration, setDuration] = useState("");
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

  function addActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const minutes = Number(duration);
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 1440) return;

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
    setDuration("");
    setIsAddingActivity(false);
  }

  const activeDays = Math.min(7, 5 + (addedMinutes > 0 ? 1 : 0));

  const activeDaysMessage = getActiveDaysMessage(activeDays);

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

        {/* <section className="kpis" aria-label="Fitness summary">
          <StatCard
            title="Steps walked"
            icon="♧"
            value={data.steps}
            percentage={12.4}
          />
          <StatCard
            title="Exercise minutes"
            icon="◷"
            value={displayedMinutes.toLocaleString()}
            percentage={8.2}
          />
          <StatCard
            title="Calories burned"
            icon="♨"
            value={displayedCalories.toLocaleString()}
            percentage={5.7}
          />

          <StatCard
            title="Active days"
            icon="✓"
            value={
              <>
                {activeDays}
                <small>/ 7</small>
              </>
            }
            message={activeDaysMessage}
          />
        </section> */}
        {/* <div className="grid">
          <section className="card panel">
            <div className="panel-head">
              <div>
                <h2>Steps walked</h2>
                <p className="subtle">
                  Your daily movement · {range.toLowerCase()}
                </p>
              </div>
              <div className="legend">
                <span>Steps</span>
                <span>Goal</span>
              </div>
            </div>
            <div className="chart-wrap">
              <TrendChart values={data.values} />
            </div>
            <div className="goal">
              <div className="goal-row">
                <span>Goal progress</span>
                <span>{data.goal}</span>
              </div>
              <div className="goal-bar">
                <span
                  style={{
                    width: `${Math.min(100, data.values.reduce((sum, value) => sum + value, 0) / 8)}%`,
                  }}
                />
              </div>
            </div>
          </section>
          <section className="card panel">
            <div className="panel-head">
              <div>
                <h2>Exercise breakdown</h2>
                <p className="subtle">Minutes by activity type</p>
              </div>
            </div>
            <div className="donut-area">
              <svg
                className="donut"
                viewBox="0 0 160 160"
                aria-label="Exercise breakdown"
              >
                <circle cx="80" cy="80" r="53" stroke="#edf3f3" />
                <circle
                  cx="80"
                  cy="80"
                  r="53"
                  stroke="#18a999"
                  strokeDasharray="120 333"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="53"
                  stroke="#ff9f43"
                  strokeDasharray="88 333"
                  strokeDashoffset="-120"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="53"
                  stroke="#7c6cf2"
                  strokeDasharray="68 333"
                  strokeDashoffset="-208"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="53"
                  stroke="#4b9cf5"
                  strokeDasharray="57 333"
                  strokeDashoffset="-276"
                />
                <text className="donut-total" x="80" y="78">
                  {displayedMinutes}
                </text>
                <text className="donut-label" x="80" y="96">
                  minutes
                </text>
              </svg>
              <div className="activity-list">
                {[
                  ["Walking", "104", "36%", "teal"],
                  ["Running", "76", "27%", "orange"],
                  ["Cycling", "58", "20%", "purple"],
                  ["Strength", "47", "17%", "blue"],
                ].map(([name, minutes, percent, color]) => (
                  <div className="activity" key={name}>
                    <i className={color} />
                    <span>{name}</span>
                    <small>{minutes} min</small>
                    <b>{percent}</b>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div> */}
        <section className="card panel table-panel">
          <div className="panel-head">
            <div>
              <h2>Recent activity</h2>
              <p className="subtle">Your latest workouts</p>
            </div>
            <button
              className="primary-button"
              onClick={() => setIsAddingActivity((current) => !current)}
            >
              {isAddingActivity ? "Close" : "+ Add activity"}
            </button>
          </div>
          {isAddingActivity && (
            <form className="activity-form" onSubmit={addActivity}>
              <label>
                Activity
                <select
                  value={activityType}
                  onChange={(event) => setActivityType(event.target.value)}
                >
                  {activityOptions.map((activity) => (
                    <option key={activity.name}>{activity.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Duration (minutes)
                <input
                  type="number"
                  min="1"
                  max="1440"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  placeholder="e.g. 30"
                  required
                />
              </label>
              <button className="primary-button" type="submit">
                Save activity
              </button>
            </form>
          )}
          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Calories</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>
                    <div className="activity-name">
                      <span className="activity-badge">{activity.icon}</span>
                      {activity.name}
                    </div>
                  </td>
                  <td>{activity.date}</td>
                  <td>{activity.duration} min</td>
                  <td>{activity.calories} kcal</td>
                  <td>
                    <span className="pill">Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
