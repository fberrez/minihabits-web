export interface Habit {
  _id: string;
  name: string;
  createdAt: Date;
  userId: string;
  completedDates: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
  completionRate7Days: number;
  completionRateYear: number;
  completionRateMonth: number;
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
  totalHabits: number;
  totalCompletions: number;
  averageStreak: number;
  completionRate7Days: number;
  completionRateYear: number;
  maxStreak: number;
  habits: HabitStats[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface Credentials {
  email: string;
  password: string;
} 