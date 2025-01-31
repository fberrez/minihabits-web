import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { SubscriptionService } from "../services/subscription";
import {
  SubscriptionStatus,
  HabitCreationStatus,
  SubscriptionTier,
} from "../types/subscription";

interface SubscriptionContextType {
  getSubscriptionStatus: () => Promise<SubscriptionStatus>;
  subscriptionStatus: SubscriptionStatus | null;
  canCreateHabit: () => Promise<HabitCreationStatus>;
  getMaxHabitsForTier: (tier: SubscriptionTier) => number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { accessToken, isAuthenticated } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);

  const getSubscriptionStatus = useCallback(async () => {
    if (!accessToken) {
      throw new Error("No access token available");
    }

    const status = await SubscriptionService.getSubscriptionStatus(accessToken);
    setSubscriptionStatus(status);
    return status;
  }, [accessToken]);

  const canCreateHabit = async (): Promise<HabitCreationStatus> => {
    if (!isAuthenticated || !accessToken) {
      throw new Error("Not authenticated");
    }

    return SubscriptionService.canCreateHabit(accessToken);
  };

  const getMaxHabitsForTier = (tier: SubscriptionTier): number => {
    return SubscriptionService.getMaxHabitsForTier(tier);
  };

  const value = {
    getSubscriptionStatus,
    subscriptionStatus,
    canCreateHabit,
    getMaxHabitsForTier,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
}
