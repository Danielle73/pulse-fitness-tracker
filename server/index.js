const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3000;

const activities = [
  {
    id: 1,
    icon: "🏃",
    name: "Running",
    createdAt: "2026-11-20T08:30:00.000Z",
    duration: 30,
    calories: 360,
  },
  {
    id: 2,
    icon: "🏊",
    name: "Swimming",
    createdAt: "2026-11-19T17:00:00.000Z",
    duration: 40,
    calories: 400,
  },
];

const activityOptions = {
  Walking: { icon: "🚶", caloriesPerMinute: 4 },
  Running: { icon: "🏃", caloriesPerMinute: 12 },
  Cycling: { icon: "🚲", caloriesPerMinute: 9 },
  "Strength training": { icon: "🏋️", caloriesPerMinute: 7 },
  Swimming: { icon: "🏊", caloriesPerMinute: 10 },
  Yoga: { icon: "🧘", caloriesPerMinute: 3 },
};

app.get("/", (req, res) => {
  res.json({
    message: "Pulse API is running!",
    status: "success",
  });
});

app.get("/api/activities", (req, res) => {
  res.json(activities);
});

app.post("/api/activities", (req, res) => {
  const newId = Math.max(...activities.map((activity) => activity.id)) + 1;

  if (typeof req.body.name !== "string" || req.body.name.trim() === "") {
    return res.status(400).json({
      message: "Activity name is required and must be a string.",
    });
  }

  if (
    typeof req.body.duration !== "number" ||
    !Number.isInteger(req.body.duration) ||
    req.body.duration < 1 ||
    req.body.duration > 1440
  ) {
    return res.status(400).json({
      message: "Invalid duration.",
    });
  }

  const selectedActivity = activityOptions[req.body.name];

  if (!selectedActivity) {
    return res.status(400).json({
      message: "Invalid activity name.",
    });
  }

  const newActivity = {
    id: newId,
    icon: selectedActivity.icon,
    name: req.body.name,
    createdAt: new Date().toISOString(),
    duration: req.body.duration,
    calories: selectedActivity.caloriesPerMinute * req.body.duration,
  };

  activities.push(newActivity);

  res.status(201).json(newActivity);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
