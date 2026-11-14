import type { Range } from "../types/dashboard";

export const ranges: Record<
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