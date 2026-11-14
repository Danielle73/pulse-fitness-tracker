export function parseMinutes(value: string): number {
  return value.endsWith("M")
    ? Number(value.slice(0, -1)) * 1000000
    : Number(value.replace(",", ""));
}