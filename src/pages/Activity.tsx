import RecentActivity from "../components/dashboard/RecentActivity";
import type { Activity as ActivityType, ActivityOption } from "../types/activity";

type ActivityProps = {
  activities: ActivityType[];
  activityOptions: ActivityOption[];
  onAddActivity: (activityType: string, duration: number) => void;
};

function Activity({
  activities,
  activityOptions,
  onAddActivity,
}: ActivityProps) {
  return (
    <RecentActivity
      activities={activities}
      activityOptions={activityOptions}
      onAddActivity={onAddActivity}
    />
  );
}

export default Activity;