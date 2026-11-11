import StatCard from "../components/dashboard/StatCard";
import TrendChart from "../components/dashboard/TrendChart";

type OverviewProps = {
  steps: string;
  minutes: number;
  calories: number;
  activeDays: number;
  activeDaysMessage: string;
  range: string;
  goal: string;
  values: number[];
};

function Overview({
  steps,
  minutes,
  calories,
  activeDays,
  activeDaysMessage,
  range,
  goal,
  values,
}: OverviewProps) {
  return (
    // We'll put the dashboard JSX here
  );
}

export default Overview;