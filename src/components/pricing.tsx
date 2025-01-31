import { Button } from "./ui/button";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SubscriptionStatus, SubscriptionTier } from "@/types/subscription";
import { useAuth } from "@/contexts/AuthContext";
import { stripeService } from "@/services/stripe";
import { useToast } from "@/hooks/use-toast";
import { MagicCard } from "./ui/magic-card";
import { useTheme } from "./theme-provider";

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  tier: SubscriptionTier;
  popular?: boolean;
  isLoading: boolean;
  setIsLoading?: (isLoading: boolean) => void;
  accessToken: string | null;
  isAuthenticated: boolean;
  isButtonDisabled: boolean;
  buttonDisabledMessage: string;
}

function PricingCard({
  title,
  price,
  period,
  features,
  tier,
  popular,
  isLoading,
  setIsLoading,
  accessToken,
  isAuthenticated,
  isButtonDisabled,
  buttonDisabledMessage,
}: PricingCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();

  const handleGetStarted = async () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    if (!accessToken) {
      toast({
        title: "Error",
        description: "Please try signing in again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading?.(true);
      const { sessionUrl } = await stripeService.createCheckoutSession(
        accessToken,
        tier
      );
      window.location.href = sessionUrl;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading?.(false);
    }
  };

  return (
    <MagicCard
      className={`w-full flex flex-col`}
      gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
    >
      <CardHeader>
        <CardTitle className="flex flex-col items-center gap-4">
          <span>{title}</span>
          <div className="flex items-start">
            <span className="text-sm mt-2">$</span>
            <span className="text-4xl font-bold">{price}</span>
            {period !== "one-time" && (
              <span className="text-sm mt-2">/{period}</span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ul className="space-y-2 flex-1 min-h-[200px]">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <div className="pt-6">
          <Button
            className="w-full"
            variant={popular ? "default" : "outline"}
            onClick={handleGetStarted}
            disabled={isLoading || isButtonDisabled}
          >
            {isLoading
              ? "Loading..."
              : isButtonDisabled
              ? buttonDisabledMessage
              : "Get Started"}
          </Button>
        </div>
      </CardContent>
    </MagicCard>
  );
}

export function Pricing({
  subscriptionStatus,
  isLoading = false,
  setIsLoading,
}: {
  subscriptionStatus?: SubscriptionStatus | null;
  isLoading?: boolean;
  setIsLoading?: (isLoading: boolean) => void;
}) {
  const { isAuthenticated, accessToken } = useAuth();

  const pricingPlans: PricingCardProps[] = [
    {
      title: "Free",
      price: "0",
      period: "forever",
      tier: SubscriptionTier.FREE,
      features: [
        "Up to 3 habits",
        "Basic analytics",
        "Community support",
        "Export data",
      ],
      isLoading,
      setIsLoading,
      accessToken,
      isAuthenticated,
      isButtonDisabled: subscriptionStatus?.tier === SubscriptionTier.FREE,
      buttonDisabledMessage: "Current plan",
    },
    {
      title: "Monthly",
      price: "0.99",
      period: "month",
      tier: SubscriptionTier.MONTHLY,
      features: [
        "Unlimited habits",
        "Detailed analytics",
        "Priority support",
        "Support indie dev",
        "Export data",
        "Cancel anytime",
      ],
      isLoading,
      setIsLoading,
      accessToken,
      isAuthenticated,
      isButtonDisabled:
        subscriptionStatus?.tier === SubscriptionTier.MONTHLY ||
        subscriptionStatus?.tier === SubscriptionTier.LIFETIME,
      buttonDisabledMessage:
        subscriptionStatus?.tier === SubscriptionTier.MONTHLY
          ? "You already have this plan"
          : "Lifetime plan enabled!",
    },
    {
      title: "Yearly",
      price: "6.99",
      period: "year",
      tier: SubscriptionTier.YEARLY,
      features: [
        "Unlimited habits",
        "Advanced analytics",
        "Priority support",
        "Support indie dev",
        "Export data",
        "Cancel anytime",
      ],
      isLoading,
      setIsLoading,
      accessToken,
      isAuthenticated,
      isButtonDisabled:
        subscriptionStatus?.tier === SubscriptionTier.YEARLY ||
        subscriptionStatus?.tier === SubscriptionTier.LIFETIME,
      buttonDisabledMessage:
        subscriptionStatus?.tier === SubscriptionTier.YEARLY
          ? "You already have this plan"
          : "Lifetime plan enabled!",
    },
    {
      title: "Lifetime",
      price: "16.99",
      period: "one-time",
      tier: SubscriptionTier.LIFETIME,
      popular: true,
      features: [
        "Unlimited habits",
        "All features included",
        "Lifetime updates",
        "Support indie dev",
        "Premium support",
        "One-time payment",
        "Best value",
      ],
      isLoading,
      setIsLoading,
      accessToken,
      isAuthenticated,
      isButtonDisabled: subscriptionStatus?.tier === SubscriptionTier.LIFETIME,
      buttonDisabledMessage: "Lifetime plan enabled!",
    },
  ];

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Simple Pricing
            </h2>
            <p className="text-muted-foreground">
              Start free, upgrade when you need more. No hidden fees.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.title} {...plan} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
