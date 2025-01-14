import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Habit, GlobalStats } from '../types/habit';

interface HabitContextType {
  habits: Habit[];
  stats: GlobalStats | null;
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
  const { isAuthenticated, authenticatedFetch } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshHabits = async (showLoading = true) => {
    if (!isAuthenticated) return;
    
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      const [habitsResponse, statsResponse] = await Promise.all([
        authenticatedFetch(`${import.meta.env.VITE_API_BASE_URL}/habits`),
        authenticatedFetch(`${import.meta.env.VITE_API_BASE_URL}/habits/stats`),
      ]);

      if (!habitsResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [habitsData, statsData] = await Promise.all([
        habitsResponse.json(),
        statsResponse.json(),
      ]);

      // Merge stats data with habits data
      const mergedHabits = habitsData.map((habit: Habit) => {
        const habitStats = statsData.habits.find((h: { name: string }) => h.name === habit.name);
        return {
          ...habit,
          completionRate7Days: habitStats?.completionRate7Days ?? 0,
          completionRateYear: habitStats?.completionRateYear ?? 0,
          completionRateMonth: habitStats?.completionRateMonth ?? 0,
        };
      });

      setHabits(mergedHabits);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch habits');
      console.error(err);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    refreshHabits(true);
  }, [isAuthenticated]);

  const createHabit = async (name: string) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await authenticatedFetch(`${import.meta.env.VITE_API_BASE_URL}/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Failed to create habit');
      }

      await refreshHabits(true);
    } catch (err) {
      setError('Failed to create habit');
      throw err;
    }
  };

  const updateHabit = async (name: string) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await authenticatedFetch(`${import.meta.env.VITE_API_BASE_URL}/habits/${name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Failed to update habit');
      }

      await refreshHabits(true);
    } catch (err) {
      setError('Failed to update habit');
      throw err;
    }
  };

  const deleteHabit = async (name: string) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await authenticatedFetch(`${import.meta.env.VITE_API_BASE_URL}/habits/${name}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete habit');
      }

      await refreshHabits(true);
    } catch (err) {
      setError('Failed to delete habit');
      throw err;
    }
  };

  const trackHabit = async (habitId: string, date: string) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await authenticatedFetch(`${import.meta.env.VITE_API_BASE_URL}/habits/${habitId}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date }),
      });

      if (!response.ok) {
        throw new Error('Failed to track habit');
      }

      await refreshHabits(false);
    } catch (err) {
      setError('Failed to track habit');
      throw err;
    }
  };

  const untrackHabit = async (habitId: string, date: string) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await authenticatedFetch(`${import.meta.env.VITE_API_BASE_URL}/habits/${habitId}/track/${date}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to untrack habit');
      }

      await refreshHabits(false);
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
        refreshHabits: () => refreshHabits(true),
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