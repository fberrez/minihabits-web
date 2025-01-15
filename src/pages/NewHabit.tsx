import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHabits } from '../contexts/HabitContext'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useToast } from "../hooks/use-toast"
import { HabitColor } from '../types/habit.ts'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function NewHabit() {
  const [name, setName] = useState('');
  const [color, setColor] = useState<HabitColor>(HabitColor.BLUE);
  const [isLoading, setIsLoading] = useState(false);
  const { createHabit } = useHabits();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createHabit(name, color);
      toast({
        title: "Habit created",
        description: "Your new habit has been created successfully.",
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to create habit:', error);
      toast({
        title: "Error",
        description: "Failed to create habit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const colorOptions = Object.values(HabitColor).map(color => ({
    value: color,
    label: color.charAt(0).toUpperCase() + color.slice(1),
  }));

  return (
    <div className="max-w-[2000px] mx-auto px-8 py-8">
      <Card className="max-w-[400px] mx-auto">
        <CardHeader>
          <CardTitle>Create a new habit</CardTitle>
          <CardDescription>
            What habit would you like to track?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Habit name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Read for 10 minutes"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <RadioGroup
                value={color}
                onValueChange={(value: HabitColor) => setColor(value)}
                className="grid grid-cols-4 gap-4"
              >
                {colorOptions.map((option) => (
                  <div key={option.value} className="flex flex-col items-center space-y-2">
                    <div className="flex items-center justify-center relative">
                      <RadioGroupItem value={option.value} id={option.value} className="sr-only peer" />
                      <Label
                        htmlFor={option.value}
                        className="w-8 h-8 rounded-full cursor-pointer ring-offset-background transition-all hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative"
                        style={{ backgroundColor: option.value }}
                      >
                        <div className="absolute inset-0 rounded-full peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-white peer-data-[state=checked]:ring-offset-2 peer-data-[state=checked]:ring-offset-[var(--color)]" style={{ "--color": option.value } as React.CSSProperties} />
                      </Label>
                    </div>
                    <span className="text-xs">{option.label}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Habit'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 