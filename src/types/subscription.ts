export enum SubscriptionTier {
  FREE = "FREE",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
  LIFETIME = "LIFETIME",
}

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  habitsCount: number;
  maxHabits: number;
  canCreateMore: boolean;
}

export interface HabitCreationStatus {
  canCreate: boolean;
  currentCount: number;
  maxAllowed: number;
}

export const SUBSCRIPTION_LIMITS = {
  [SubscriptionTier.FREE]: 3,
  [SubscriptionTier.MONTHLY]: Number.POSITIVE_INFINITY,
  [SubscriptionTier.YEARLY]: Number.POSITIVE_INFINITY,
  [SubscriptionTier.LIFETIME]: Number.POSITIVE_INFINITY,
} as const;
