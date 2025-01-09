import { useHabits } from '../contexts/HabitContext'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { useNavigate } from 'react-router-dom'

export function StatsPage() {
  const { stats } = useHabits();
  const navigate = useNavigate();

  if (!stats) return null;

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Statistics</h1>
        <Button onClick={() => navigate('/')}>Back to Habits</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.habits.map((habit) => (
          <Card key={habit.name}>
            <CardHeader>
              <CardTitle>{habit.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Current Streak: {habit.currentStreak} days</p>
              <p>Longest Streak: {habit.longestStreak} days</p>
              <p>Total Completions: {habit.completions}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Total Habits: {stats.totalHabits}</p>
          <p>Total Completions: {stats.totalCompletions}</p>
          <p>Average Streak: {stats.averageStreak}</p>
        </CardContent>
      </Card>
    </div>
  );
} 