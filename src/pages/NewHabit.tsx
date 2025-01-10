import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHabits } from '../contexts/HabitContext'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useToast } from "../hooks/use-toast"

export function NewHabit() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createHabit } = useHabits();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createHabit(name);
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