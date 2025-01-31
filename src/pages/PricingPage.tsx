import { Pricing } from "@/components/pricing";
import { useEffect } from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { SubscriptionStatus } from "@/types/subscription";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function PricingPage() {
  const { getSubscriptionStatus } = useSubscription();
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      getSubscriptionStatus().then((status) => {
        setSubscriptionStatus(status);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [getSubscriptionStatus, setSubscriptionStatus, isAuthenticated]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <Pricing
        subscriptionStatus={subscriptionStatus}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}
