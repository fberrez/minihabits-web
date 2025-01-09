import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { HabitService } from '../services/habits';
import { useAuth } from './AuthContext';

interface Habit {
  _id: string;
  name: string;
  createdAt: Date;
  userId: string;
  completedDates: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
}

interface Stats {
  totalHabits: number;
  completedToday: number;
  averageCompletion: number;
  longestStreak: number;
}

interface HabitContextType {
  habits: Habit[];
  stats: Stats | null;
  isLoading: boolean;
  error: string | null;
  createHabit: (name: string) => Promise<void>;
  updateHabit: (name: string) => Promise<void>;
  deleteHabit: (name: string) => Promise<void>;
  trackHabit: (habitId: string, date: string) => Promise<void>;
  untrackHabit: (habitId: string, date: string) => Promise<void>;
  refreshHabits: () => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshHabits = async () => {
    if (!accessToken) return;
    
    try {
      setIsLoading(true);
      const [habitsData, statsData] = await Promise.all([
        HabitService.getHabits(accessToken),
        HabitService.getStats(accessToken),
      ]);
      setHabits(habitsData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch habits');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshHabits();
  }, [accessToken]);

  const createHabit = async (name: string) => {
    if (!accessToken) return;
    
    try {
      await HabitService.createHabit(accessToken, name);
      await refreshHabits();
    } catch (err) {
      setError('Failed to create habit');
      throw err;
    }
  };

  const updateHabit = async (name: string) => {
    if (!accessToken) return;
    
    try {
      await HabitService.updateHabit(accessToken, name);
      await refreshHabits();
    } catch (err) {
      setError('Failed to update habit');
      throw err;
    }
  };

  const deleteHabit = async (name: string) => {
    if (!accessToken) return;
    
    try {
      await HabitService.deleteHabit(accessToken, name);
      await refreshHabits();
    } catch (err) {
      setError('Failed to delete habit');
      throw err;
    }
  };

  const trackHabit = async (habitId: string, date: string) => {
    if (!accessToken) return;
    
    try {
      await HabitService.trackHabit(accessToken, habitId, date);
      await refreshHabits();
    } catch (err) {
      setError('Failed to track habit');
      throw err;
    }
  };

  const untrackHabit = async (habitId: string, date: string) => {
    if (!accessToken) return;
    
    try {
      await HabitService.untrackHabit(accessToken, habitId, date);
      await refreshHabits();
    } catch (err) {
      setError('Failed to untrack habit');
      throw err;
    }
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        stats,
        isLoading,
        error,
        createHabit,
        updateHabit,
        deleteHabit,
        trackHabit,
        untrackHabit,
        refreshHabits,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
} 