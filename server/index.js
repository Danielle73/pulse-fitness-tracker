require("dotenv").config();

const express = require("express");

const pool = require("./db");

const app = express();
app.use(express.json());

const PORT = 3000;

pool.query("SELECT NOW()", (error, result) => {
  if (error) {
    console.error("Database connection failed:", error);
  } else {
    console.log("Database connected:", result.rows[0]);
  }
});

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

app.get("/api/activities", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        id, 
        icon, 
        name, 
        created_at AS "createdAt", 
        duration, 
        calories 
      FROM activities
      ORDER BY created_at DESC`,
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching activities:", error);

    res.status(500).json({
      message: "Failed to fetch activities.",
    });
  }
});

app.post("/api/activities", async (req, res) => {
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

  try {
    const result = await pool.query(
      `INSERT INTO activities (icon, name, duration, calories)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        selectedActivity.icon,
        req.body.name,
        req.body.duration,
        selectedActivity.caloriesPerMinute * req.body.duration,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating activity:", error);

    res.status(500).json({
      message: "Failed to create activity.",
    });
  }
});

// app.put("/api/activities/:id", (req, res) => {
//   const existingActivity = activities.find(
//     (activity) => activity.id === Number(req.params.id),
//   );

//   if (!existingActivity) {
//     return res.status(404).json({
//       message: "Activity not found.",
//     });
//   }

//   if (typeof req.body.name !== "string" || req.body.name.trim() === "") {
//     return res.status(400).json({
//       message: "Activity name is required and must be a string.",
//     });
//   }

//   if (
//     typeof req.body.duration !== "number" ||
//     !Number.isInteger(req.body.duration) ||
//     req.body.duration < 1 ||
//     req.body.duration > 1440
//   ) {
//     return res.status(400).json({
//       message: "Invalid duration.",
//     });
//   }

//   const selectedActivity = activityOptions[req.body.name];

//   if (!selectedActivity) {
//     return res.status(400).json({
//       message: "Invalid activity name.",
//     });
//   }

//   existingActivity.icon = selectedActivity.icon;
//   existingActivity.name = req.body.name;
//   existingActivity.duration = req.body.duration;
//   existingActivity.calories =
//     req.body.duration * selectedActivity.caloriesPerMinute;

//   res.status(200).json(existingActivity);
// });


app.put("/api/activities/:id", async (req, res) => {
  const activityId = Number(req.params.id);

  if (!Number.isInteger(activityId) || activityId < 1) {
    return res.status(404).json({
      message: "Activity not found.",
    });
  }

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

  try {
    const result = await pool.query(
      `UPDATE activities
       SET
         icon = $1,
         name = $2,
         duration = $3,
         calories = $4
       WHERE id = $5
       RETURNING
         id,
         icon,
         name,
         created_at AS "createdAt",
         duration,
         calories`,
      [
        selectedActivity.icon,
        req.body.name,
        req.body.duration,
        req.body.duration * selectedActivity.caloriesPerMinute,
        activityId,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Activity not found.",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating activity:", error);

    res.status(500).json({
      message: "Failed to update activity.",
    });
  }
});


app.delete("/api/activities/:id", (req, res) => {
  const activityIndex = activities.findIndex(
    (activity) => activity.id === Number(req.params.id),
  );

  if (activityIndex === -1) {
    return res.status(404).json({
      message: "Activity not found.",
    });
  }

  activities.splice(activityIndex, 1);

  res.status(200).json({
    message: "Activity deleted successfully.",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
