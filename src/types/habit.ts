export enum HabitColor {
  RED = '#ff8c82',
  BLUE = '#99c1f1',
  GREEN = '#8ff0a4',
  YELLOW = '#f9c74f',
  PURPLE = '#dc8add',
  ORANGE = '#ffa94d',
  PINK = '#ffadc6',
  TEAL = '#94ebcd',
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