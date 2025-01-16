import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../contexts/HabitContext';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { HabitColor } from '../types/habit.ts';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Lightbulb } from 'lucide-react';

const habitSuggestions = [
  'Read for 1 minute',
  'Meditate for 1 minute',
  'Do 1 pushup',
  'Write 1 sentence',
  'Drink 1 glass of water',
  'Walk for 1 minute',
];

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
        title: 'Habit created',
        description: 'Your new habit has been created successfully.',
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to create habit:', error);
      toast({
        title: 'Error',
        description: 'Failed to create habit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const colorOptions = Object.entries(HabitColor).map(([key, value]) => ({
    value: value,
    label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
  }));

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
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Read for 1 minute"
                disabled={isLoading}
                required
              />
              <div className="space-y-2 flex flex-col items-center">
                <Label className="text-sm text-muted-foreground">
                  Suggestions (click to use):
                </Label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {habitSuggestions.map(suggestion => (
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

            <div className="space-y-2">
              <Label>Color</Label>
              <RadioGroup
                value={color}
                onValueChange={(value: HabitColor) => setColor(value)}
                className="grid grid-cols-4 gap-4"
              >
                {colorOptions.map(option => (
                  <div
                    key={option.value}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div className="flex items-center justify-center relative">
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="sr-only peer"
                      />
                      <Label
                        htmlFor={option.value}
                        className="w-8 h-8 rounded-full cursor-pointer ring-offset-background transition-all hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative"
                        style={{ backgroundColor: option.value }}
                      >
                        <div
                          className="absolute inset-0"
                          style={
                            { '--color': option.value } as React.CSSProperties
                          }
                        />
                      </Label>
                    </div>
                    <span className="text-xs">{option.label}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? 'Creating...' : 'Create Habit'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
