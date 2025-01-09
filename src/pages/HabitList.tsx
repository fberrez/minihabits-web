import { useState } from 'react'
import { useHabits } from '../contexts/HabitContext'
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"
import { useNavigate } from 'react-router-dom'
import { Flame } from 'lucide-react'

export function HabitList() {
  const { habits, isLoading, trackHabit, untrackHabit } = useHabits();
  const navigate = useNavigate();

  const getLast5Days = () => {
    const dates = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  if (isLoading) {
    return (
      <div className="max-w-[2000px] mx-auto px-8 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">minihabits.</h1>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/stats')}>View Stats</Button>
            <Button onClick={() => navigate('/new')}>New Habit</Button>
          </div>
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-8">
                  <div className="min-w-[200px]">
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="flex gap-6">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="flex flex-col items-center gap-1">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[2000px] mx-auto px-8 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">minihabits.</h1>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/stats')}>View Stats</Button>
          <Button onClick={() => navigate('/new')}>New Habit</Button>
        </div>
      </div>

      <div className="space-y-4">
        {habits.map((habit) => {
          const last5Days = getLast5Days();
          return (
            <Card key={habit._id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-8">
                  <div className="min-w-[200px] flex flex-col">
                    <h3 className="font-medium">{habit.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1 self-start">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>{habit.currentStreak}</span>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    {last5Days.map((date) => {
                      const dateStr = date.toISOString().split('T')[0];
                      const isCompleted = habit.completedDates[dateStr];
                      return (
                        <div key={dateStr} className="flex flex-col items-center gap-1">
                          <div className="text-xs text-muted-foreground">
                            {formatDate(date)}
                          </div>
                          <Button
                            onClick={() => isCompleted ? untrackHabit(habit._id, dateStr) : trackHabit(habit._id, dateStr)}
                            className={`w-8 h-8 rounded-full border-2 transition-colors ${
                              isCompleted 
                                ? 'bg-primary border-primary hover:bg-primary/90' 
                                : 'bg-background border-black hover:bg-purple-100 hover:border-purple-500'
                            }`}
                            aria-label={isCompleted ? 'Completed' : 'Not completed'}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 