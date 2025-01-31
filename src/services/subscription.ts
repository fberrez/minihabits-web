import {
  SubscriptionStatus,
  HabitCreationStatus,
  SubscriptionTier,
  SUBSCRIPTION_LIMITS,
} from "../types/subscription";

export class SubscriptionService {
  private static BASE_URL = import.meta.env.VITE_API_BASE_URL;

  private static getHeaders(accessToken: string): HeadersInit {
    return {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
  }

  static async getSubscriptionStatus(
    accessToken: string
  ): Promise<SubscriptionStatus> {
    const response = await fetch(`${this.BASE_URL}/users/subscription/status`, {
      method: "GET",
      headers: this.getHeaders(accessToken),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch subscription data");
    }

    return response.json();
  }

  static async createCheckoutSession(
    accessToken: string,
    tier: SubscriptionTier
  ): Promise<{ url: string }> {
    const response = await fetch(
      `${this.BASE_URL}/users/subscription/create-checkout-session`,
      {
        method: "POST",
        headers: this.getHeaders(accessToken),
        body: JSON.stringify({ tier }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    return response.json();
  }

  static async canCreateHabit(
    accessToken: string
  ): Promise<HabitCreationStatus> {
    const response = await fetch(
      `${this.BASE_URL}/users/subscription/can-create-habit`,
      {
        method: "GET",
        headers: this.getHeaders(accessToken),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to check habit creation status");
    }

    return response.json();
  }

  static getMaxHabitsForTier(tier: SubscriptionTier): number {
    return SUBSCRIPTION_LIMITS[tier];
  }
}

export const subscriptionService = {
  getSubscriptionStatus: (accessToken: string) =>
    SubscriptionService.getSubscriptionStatus(accessToken),
  createCheckoutSession: (accessToken: string, tier: SubscriptionTier) =>
    SubscriptionService.createCheckoutSession(accessToken, tier),
  canCreateHabit: (accessToken: string) =>
    SubscriptionService.canCreateHabit(accessToken),
  getMaxHabitsForTier: (tier: SubscriptionTier) =>
    SubscriptionService.getMaxHabitsForTier(tier),
};
