export function getActiveDaysMessage(days: number): string {
  if (days === 0) return "Let's get moving!";
  if (days === 1) return "Great start!";
  if (days <= 3) return "You're building momentum!";
  if (days <= 5) return "Great consistency!";
  if (days === 6) return "Almost there!";
  return "Weekly goal achieved!";
}