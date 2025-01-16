export enum HabitColor {
  RED = '#e57373',
  BLUE = '#64b5f6',
  GREEN = '#81c784',
  YELLOW = '#ffd54f',
  PURPLE = '#ba68c8',
  ORANGE = '#ffb74d',
  PINK = '#f06292',
  TEAL = '#4db6ac',
}

export interface Habit {
  _id: string;
  name: string;
  color: HabitColor;
  createdAt: Date;
  userId: string;
  completedDates: { [key: string]: number };
  currentStreak: number;
  longestStreak: number;
  completionRate7Days: number;
  completionRateMonth: number;
  completionRateYear: number;
}

export interface HabitStats {
  name: string;
  currentStreak: number;
  longestStreak: number;
  completions: number;
  completionRate7Days: number;
  completionRateYear: number;
  completionRateMonth: number;
}

export interface GlobalStats {
  habits: {
    name: string;
    completionRate7Days: number;
    completionRateMonth: number;
    completionRateYear: number;
  }[];
  totalCompletions: number;
  totalHabits: number;
  averageCompletionRate: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface Credentials {
  email: string;
  password: string;
}
