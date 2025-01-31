import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHabits } from "../contexts/HabitContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { HabitColor, HabitType } from "../types/habit";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Lightbulb } from "lucide-react";
import { ColorPicker } from "../components/color-picker";

const habitSuggestions = [
  "Read for 10 minutes",
  "Meditate for 10 minutes",
  "Do 10 pushups",
  "Write 10 sentences",
  "Drink 10 glasses of water",
  "Walk for 10 minutes",
];

const getRandomColor = () => {
  const colors = Object.values(HabitColor);
  return colors[Math.floor(Math.random() * colors.length)];
};

export function NewHabit() {
  const [name, setName] = useState("");
  const [color, setColor] = useState<HabitColor>(getRandomColor());
  const [type, setType] = useState<HabitType>(HabitType.BOOLEAN);
  const [targetCounter, setTargetCounter] = useState<number>(1);
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const { createHabit } = useHabits();
  const { getSubscriptionStatus } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !color) {
      toast({
        title: "Missing required fields",
        description: "Please provide both a habit name and select a color.",
        variant: "destructive",
      });
      return;
    }

    if (type === HabitType.COUNTER && (!targetCounter || targetCounter <= 0)) {
      toast({
        title: "Invalid target counter",
        description:
          "Please provide a target counter greater than 0 for counter type habits.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingSubscription(true);

    try {
      const subscriptionStatus = await getSubscriptionStatus();
      if (!subscriptionStatus.canCreateMore) {
        toast({
          title: "Subscription Limit Reached",
          description: `You've reached your habit limit (${subscriptionStatus.habitsCount}/${subscriptionStatus.maxHabits}). Please upgrade your subscription to create more habits.`,
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);

      await createHabit(
        name,
        color,
        type,
        type === HabitType.COUNTER ? targetCounter : undefined,
        type === HabitType.TASK ? description : undefined,
        type === HabitType.TASK && deadline ? new Date(deadline) : undefined
      );

      toast({
        title: "Habit created",
        description: "Your new habit has been created successfully.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create habit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingSubscription(false);
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setName(suggestion);
  };

  return (
    <div className="max-w-[2000px] mx-auto px-8 py-8">
      <Card className="max-w-[600px] mx-auto">
        <CardHeader>
          <CardTitle>Create a new habit</CardTitle>
          <CardDescription>
            Start with a tiny habit - something so easy you can't say no. The
            key is consistency, not intensity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Mini Habits Tip:</strong> Make it so small that it feels
              ridiculous. You can always do more, but start with the minimum to
              build consistency.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="name">Habit name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Read for 10 minute"
                disabled={isLoading || isCheckingSubscription}
                required
              />
              <div className="space-y-2 flex flex-col items-center">
                <Label className="text-sm text-muted-foreground">
                  Suggestions (click to use):
                </Label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {habitSuggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-sm"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 flex flex-col items-center">
              <Label>Type</Label>
              <RadioGroup
                value={type}
                onValueChange={(value: HabitType) => setType(value)}
                className="grid grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={HabitType.BOOLEAN} id="boolean" />
                  <Label htmlFor="boolean">Daily Check</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={HabitType.COUNTER} id="counter" />
                  <Label htmlFor="counter">Counter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={HabitType.TASK} id="task" />
                  <Label htmlFor="task">Task</Label>
                </div>
              </RadioGroup>
            </div>

            {type === HabitType.COUNTER && (
              <div className="space-y-2">
                <Label htmlFor="targetCounter">Daily Target</Label>
                <Input
                  id="targetCounter"
                  type="number"
                  min="1"
                  value={targetCounter}
                  onChange={(e) => setTargetCounter(parseInt(e.target.value))}
                  placeholder="e.g., 8 glasses of water"
                  disabled={isLoading || isCheckingSubscription}
                  required
                />
              </div>
            )}

            {type === HabitType.TASK && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your task..."
                    disabled={isLoading || isCheckingSubscription}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline (optional)</Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    disabled={isLoading || isCheckingSubscription}
                  />
                </div>
              </>
            )}

            <ColorPicker
              value={color}
              onChange={(value: HabitColor) => setColor(value)}
              disabled={isLoading || isCheckingSubscription}
            />
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
            disabled={isLoading || isCheckingSubscription}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || isCheckingSubscription}
            onClick={handleSubmit}
          >
            {isLoading || isCheckingSubscription
              ? "Creating..."
              : "Create Habit"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
