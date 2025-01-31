import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { stripeService } from "@/services/stripe";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FeedbackButton } from "@/components/feedback-button";
import JSConfetti from "js-confetti";
import { playSuccessSound } from "@/lib/sound";

export function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const jsConfettiRef = useRef<JSConfetti>(new JSConfetti());

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId || !accessToken) {
        navigate("/pricing");
        return;
      }

      try {
        await stripeService.verifySession(accessToken, sessionId);
        // Trigger confetti and success sound
        jsConfettiRef.current?.addConfetti();
        playSuccessSound();
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifySession();
  }, [sessionId, accessToken, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {isVerifying
              ? "Verifying your subscription..."
              : error
              ? "Error"
              : "Thank you!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isVerifying ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="space-y-4 text-center">
              <p>Error: {error.message}</p>
              <p>
                Please try again or <FeedbackButton label="contact support" />{" "}
                if the problem persists.
              </p>
              <Button onClick={() => navigate("/pricing")}>Try again</Button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <p>Your subscription has been successfully activated!</p>
              <Button onClick={() => navigate("/")}>Go to Dashboard</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
