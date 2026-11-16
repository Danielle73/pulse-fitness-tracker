import { useState } from "react";
import type { FormEvent } from "react";
import type { Activity, ActivityOption } from "../../types/activity";
import { formatActivityDate } from "../../utils/formatters";

type RecentActivityProps = {
  activities: Activity[];
  activityOptions: ActivityOption[];
  onAddActivity: (activityType: string, duration: number) => void;
  onDeleteActivity: (id: number) => void;
  onUpdateActivity: (updatedActivity: Activity) => void;
};

function RecentActivity({
  activities,
  activityOptions,
  onAddActivity,
  onDeleteActivity,
  onUpdateActivity,
}: RecentActivityProps) {
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [activityType, setActivityType] = useState(activityOptions[0].name);
  const [duration, setDuration] = useState("");
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  function handleCloseForm() {
    setIsAddingActivity(false);
    setEditingActivity(null);
    setActivityType(activityOptions[0].name);
    setDuration("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const minutes = Number(duration);

    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 1440) {
      return;
    }

    if (editingActivity) {
      const selectedActivity = activityOptions.find(
        (activity) => activity.name === activityType,
      );

      if (!selectedActivity) return;

      onUpdateActivity({
        ...editingActivity,
        icon: selectedActivity.icon,
        name: selectedActivity.name,
        duration: minutes,
        calories: minutes * selectedActivity.caloriesPerMinute,
      });
    } else {
      onAddActivity(activityType, minutes);
    }

    setDuration("");
    setEditingActivity(null);
    setIsAddingActivity(false);
  }

  return (
    <section className="card panel table-panel">
      <div className="panel-head">
        <div>
          <h2>Recent activity</h2>
          <p className="subtle">Your latest workouts</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            if (isAddingActivity) {
              handleCloseForm();
            } else {
              setIsAddingActivity(true);
            }
          }}
        >
          {isAddingActivity ? "Close" : "+ Add activity"}
        </button>
      </div>
      {isAddingActivity && (
        <form className="activity-form" onSubmit={handleSubmit}>
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
            <th>Actions</th>
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

              <td>{formatActivityDate(activity.createdAt)}</td>

              {/* <td>{activity.createdAt}</td> */}
              <td>{activity.duration} min</td>
              <td>{activity.calories} kcal</td>
              <td>
                <span className="pill">Completed</span>
              </td>
              <td>
                <button
                  className="primary-button"
                  onClick={() => onDeleteActivity(activity.id)}
                >
                  Delete
                </button>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => {
                    setEditingActivity(activity);
                    setActivityType(activity.name);
                    setDuration(String(activity.duration));
                    setIsAddingActivity(true);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default RecentActivity;
