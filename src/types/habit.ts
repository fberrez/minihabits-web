export enum HabitColor {
  RED = "#e57373",
  BLUE = "#64b5f6",
  GREEN = "#81c784",
  YELLOW = "#ffd54f",
  PURPLE = "#ba68c8",
  ORANGE = "#ffb74d",
  PINK = "#f06292",
  TEAL = "#4db6ac",
}

/**
 * color range for each habit color for cal-heatmap in @StatsPage.tsx
 */
export const getColorRange = {
  [HabitColor.RED]: [
    "rgba(229, 115, 115, 0.25)",
    "rgba(229, 115, 115, 0.5)",
    "rgba(229, 115, 115, 0.75)",
    "rgba(229, 115, 115, 1)",
  ],
  [HabitColor.BLUE]: [
    "rgba(100, 181, 246, 0.25)",
    "rgba(100, 181, 246, 0.5)",
    "rgba(100, 181, 246, 0.75)",
    "rgba(100, 181, 246, 1)",
  ],
  [HabitColor.GREEN]: [
    "rgba(129, 199, 132, 0.25)",
    "rgba(129, 199, 132, 0.5)",
    "rgba(129, 199, 132, 0.75)",
    "rgba(129, 199, 132, 1)",
  ],
  [HabitColor.YELLOW]: [
    "rgba(255, 213, 79, 0.25)",
    "rgba(255, 213, 79, 0.5)",
    "rgba(255, 213, 79, 0.75)",
    "rgba(255, 213, 79, 1)",
  ],
  [HabitColor.PURPLE]: [
    "rgba(186, 104, 200, 0.25)",
    "rgba(186, 104, 200, 0.5)",
    "rgba(186, 104, 200, 0.75)",
    "rgba(186, 104, 200, 1)",
  ],
  [HabitColor.ORANGE]: [
    "rgba(255, 183, 77, 0.25)",
    "rgba(255, 183, 77, 0.5)",
    "rgba(255, 183, 77, 0.75)",
    "rgba(255, 183, 77, 1)",
  ],
  [HabitColor.PINK]: [
    "rgba(240, 98, 146, 0.25)",
    "rgba(240, 98, 146, 0.5)",
    "rgba(240, 98, 146, 0.75)",
    "rgba(240, 98, 146, 1)",
  ],
  [HabitColor.TEAL]: [
    "rgba(77, 182, 172, 0.25)",
    "rgba(77, 182, 172, 0.5)",
    "rgba(77, 182, 172, 0.75)",
    "rgba(77, 182, 172, 1)",
  ],
};

export enum HabitType {
  BOOLEAN = "boolean",
  COUNTER = "counter",
  NEGATIVE_BOOLEAN = "negative_boolean",
  NEGATIVE_COUNTER = "negative_counter",
}

export interface Habit {
  _id: string;
  name: string;
  color: HabitColor;
  type: HabitType;
  targetCounter: number;
  createdAt: Date;
  userId: string;
  completedDates: { [key: string]: number };
  currentStreak: number;
  longestStreak: number;
  completionRate7Days: number;
  completionRateMonth: number;
  completionRateYear: number;
  description?: string;
  deadline?: Date;
}

export interface HabitStat {
  name: string;
  type: HabitType;
  targetCounter?: number;
  currentStreak: number;
  longestStreak: number;
  completions: number;
  completionRate7Days: number;
  completionRateYear: number;
  completionRateMonth: number;
}

export interface GlobalStats {
  totalHabits: number;
  totalCompletions: number;
  habitsCompletedToday: number;
  averageStreak: number;
  completionRate7Days: number;
  completionRateYear: number;
  maxStreak: number;
  habits: HabitStat[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface Credentials {
  email: string;
  password: string;
}
