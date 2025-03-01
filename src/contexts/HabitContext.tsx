import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { Habit, HabitColor, HabitType, HabitStat } from "../types/habit";
import { HabitService } from "../services/habits";

interface HabitContextType {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
  createHabit: (
    name: string,
    color?: HabitColor,
    type?: HabitType,
    targetCounter?: number,
    description?: string,
    deadline?: Date | null
  ) => Promise<void>;
  updateHabit: (
    habitId: string,
    data: {
      name?: string;
      color?: HabitColor;
      deadline?: Date | null;
      description?: string;
      targetCounter?: number;
      type?: HabitType;
    }
  ) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  trackHabit: (habitId: string, date: string) => Promise<void>;
  untrackHabit: (habitId: string, date: string) => Promise<void>;
  incrementHabit: (habitId: string, date: string) => Promise<void>;
  decrementHabit: (habitId: string, date: string) => Promise<void>;
  refreshHabits: () => Promise<void>;
  getStats: (habitId: string) => Promise<HabitStat>;
  getHabitById: (habitId: string) => Promise<Habit>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, accessToken, authenticatedFetch } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshHabits = async (showLoading = true) => {
    if (!isAuthenticated) return;

    try {
      if (showLoading) {
        setIsLoading(true);
      }

      const habitsResponse = await authenticatedFetch(
        `${import.meta.env.VITE_API_BASE_URL}/habits`
      );

      if (!habitsResponse.ok) {
        throw new Error("Failed to fetch habits");
      }

      const habitsData = await habitsResponse.json();

      // Set habits without stats data
      setHabits(habitsData);
      setError(null);
    } catch {
      setError("Failed to fetch habits");
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  const getHabitById = async (habitId: string) => {
    if (!isAuthenticated || !accessToken) return;
    setIsLoading(true);

    const response = await authenticatedFetch(
      `${import.meta.env.VITE_API_BASE_URL}/habits/${habitId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch habit");
    }

    const habit = await response.json();
    setIsLoading(false);
    return habit;
  };

  const createHabit = async (
    name: string,
    color?: HabitColor,
    type: HabitType = HabitType.BOOLEAN,
    targetCounter?: number
  ) => {
    if (!isAuthenticated || !accessToken) return;

    try {
      await HabitService.createHabit(
        accessToken,
        name,
        color,
        type,
        type === HabitType.COUNTER || type === HabitType.NEGATIVE_COUNTER
          ? targetCounter
          : undefined
      );
      await refreshHabits(true);
    } catch (err) {
      setError("Failed to create habit");
      throw err;
    }
  };

  const updateHabit = async (
    habitId: string,
    data: {
      name?: string;
      color?: HabitColor;
      deadline?: Date | null;
      description?: string;
      targetCounter?: number;
      type?: HabitType;
    }
  ) => {
    if (!isAuthenticated) return;
    try {
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_BASE_URL}/habits/${habitId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update habit");
      }

      await refreshHabits(true);
    } catch (err) {
      setError("Failed to update habit");
      throw err;
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!isAuthenticated) return;

    try {
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_BASE_URL}/habits/${habitId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete habit");
      }

      await refreshHabits(true);
    } catch (err) {
      setError("Failed to delete habit");
      throw err;
    }
  };

  const trackHabit = async (habitId: string, date: string) => {
    if (!isAuthenticated) return;

    try {
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_BASE_URL}/habits/${habitId}/track`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to track habit");
      }

      await refreshHabits(false);
    } catch (err) {
      setError("Failed to track habit");
      throw err;
    }
  };

  const untrackHabit = async (habitId: string, date: string) => {
    if (!isAuthenticated) return;

    try {
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_BASE_URL}/habits/${habitId}/track`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to untrack habit");
      }

      await refreshHabits(false);
    } catch (err) {
      setError("Failed to untrack habit");
      throw err;
    }
  };

  const incrementHabit = async (habitId: string, date: string) => {
    if (!isAuthenticated || !accessToken) return;

    try {
      await HabitService.trackHabit(accessToken, habitId, date);
      await refreshHabits(false);
    } catch (err) {
      setError("Failed to increment habit");
      throw err;
    }
  };

  const decrementHabit = async (habitId: string, date: string) => {
    if (!isAuthenticated || !accessToken) return;

    try {
      await HabitService.untrackHabit(accessToken, habitId, date);
      await refreshHabits(false);
    } catch (err) {
      setError("Failed to decrement habit");
      throw err;
    }
  };

  const getStats = useCallback(
    async (habitId: string) => {
      if (!isAuthenticated || !accessToken) {
        throw new Error("Not authenticated");
      }

      try {
        const statsData = await HabitService.getStats(accessToken, habitId);
        return statsData;
      } catch (err) {
        setError("Failed to fetch habit stats");
        throw err;
      }
    },
    [isAuthenticated, accessToken]
  );

  return (
    <HabitContext.Provider
      value={{
        habits,
        isLoading,
        error,
        createHabit,
        updateHabit,
        deleteHabit,
        trackHabit,
        untrackHabit,
        incrementHabit,
        decrementHabit,
        refreshHabits: () => refreshHabits(true),
        getStats,
        getHabitById,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
}
