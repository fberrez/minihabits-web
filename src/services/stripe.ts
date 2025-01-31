import { SubscriptionTier } from "@/types/subscription";

const PRICE_IDS: Partial<Record<SubscriptionTier, string>> = {
  [SubscriptionTier.MONTHLY]: import.meta.env.VITE_STRIPE_PRICE_MONTHLY_ID,
  [SubscriptionTier.YEARLY]: import.meta.env.VITE_STRIPE_PRICE_YEARLY_ID,
  [SubscriptionTier.LIFETIME]: import.meta.env.VITE_STRIPE_PRICE_LIFETIME_ID,
} as const;

export class StripeService {
  private static BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/stripe`;

  private static getHeaders(accessToken: string): HeadersInit {
    return {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
  }

  static async createCheckoutSession(
    accessToken: string,
    tier: SubscriptionTier
  ): Promise<{ sessionUrl: string }> {
    const priceId = PRICE_IDS[tier];
    if (!priceId) {
      throw new Error("Invalid subscription tier");
    }

    const response = await fetch(`${this.BASE_URL}/create-checkout-session`, {
      method: "POST",
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({ priceId }),
    });

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const { sessionUrl } = await response.json();
    return { sessionUrl };
  }

  static async verifySession(
    accessToken: string,
    sessionId: string
  ): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/verify-session`, {
      method: "POST",
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      throw new Error("Failed to verify session");
    }
  }

  static async cancelSubscription(accessToken: string): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/subscription/cancel`, {
      method: "POST",
      headers: this.getHeaders(accessToken),
    });

    if (!response.ok) {
      throw new Error("Failed to cancel subscription");
    }
  }
}

export const stripeService = {
  createCheckoutSession: (accessToken: string, tier: SubscriptionTier) =>
    StripeService.createCheckoutSession(accessToken, tier),
  verifySession: (accessToken: string, sessionId: string) =>
    StripeService.verifySession(accessToken, sessionId),
  cancelSubscription: (accessToken: string) =>
    StripeService.cancelSubscription(accessToken),
};
