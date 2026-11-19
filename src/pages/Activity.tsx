import RecentActivity from "../components/dashboard/RecentActivity";
import type { Activity as ActivityType, ActivityOption } from "../types/activity";

type ActivityProps = {
  activities: ActivityType[];
  activityOptions: ActivityOption[];
  onAddActivity: (activityType: string, duration: number) => void;
  onDeleteActivity: (id: number) => void;
  onUpdateActivity: (updatedActivity: ActivityType) => void;
};

function Activity({
  activities,
  activityOptions,
  onAddActivity,
  onDeleteActivity,
  onUpdateActivity,
}: ActivityProps) {
  return (
    <RecentActivity
      activities={activities}
      activityOptions={activityOptions}
      onAddActivity={onAddActivity}
      onDeleteActivity={onDeleteActivity}
      onUpdateActivity={onUpdateActivity}
    />
  );
}

export default Activity;