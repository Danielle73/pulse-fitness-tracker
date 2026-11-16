import type { Range } from "../types/dashboard";

export function parseMinutes(value: string): number {
  return value.endsWith("M")
    ? Number(value.slice(0, -1)) * 1000000
    : Number(value.replace(",", ""));
}

export function formatActivityDate(createdAt: string): string {
  return new Date(createdAt).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function isActivityInRange(
  createdAt: string,
  range: Range,
): boolean {
  const activityDate = new Date(createdAt);
  const today = new Date();

  let startDate: Date;
  let endDate: Date;

  if (range === "This week") {
    // Find the beginning of this week (Monday)
    startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const daysSinceMonday = (today.getDay() + 6) % 7;

    startDate.setDate(startDate.getDate() - daysSinceMonday);

    // The end date is the following Monday
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);
  } else if (range === "This month") {
    startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );

    endDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1,
    );
  } else {
    // This year
    startDate = new Date(today.getFullYear(), 0, 1);
    endDate = new Date(today.getFullYear() + 1, 0, 1);
  }

  return activityDate >= startDate && activityDate < endDate;
}