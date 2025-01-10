import { useRef, useEffect } from 'react'
import { useHabits } from '../contexts/HabitContext'
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"
import { useNavigate } from 'react-router-dom'
import { Flame, Trophy, Check, Plus } from 'lucide-react'
import JSConfetti from 'js-confetti'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"

export function HabitList() {
  const { habits, isLoading, trackHabit, untrackHabit } = useHabits();
  const navigate = useNavigate();
  const jsConfettiRef = useRef<JSConfetti | null>(null);

  useEffect(() => {
    jsConfettiRef.current = new JSConfetti()
  }, [])

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
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">minihabits.</h1>
          <div className="flex gap-4">
            <Button size="icon" onClick={() => navigate('/new')}>
              <Plus className="inline h-4 w-4" />
            </Button>
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
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">minihabits.</h1>
        <div className="flex gap-4">
          <Button size="icon" onClick={() => navigate('/new')}>
            <Plus className="inline h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {habits.map((habit) => {
          const last5Days = getLast5Days();
          const today = last5Days[4];
          const todayStr = today.toISOString().split('T')[0];
          
          return (
            <Card 
              key={habit._id} 
              className="cursor-pointer transition-all duration-200 hover:shadow-md hover:translate-x-1 hover:-translate-y-1 hover:bg-accent/50"
              onClick={() => navigate(`/stats/${habit._id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-medium hover:text-primary">
                        {habit.name}
                      </h3>
                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                              <span>
                                <Flame className="w-4 h-4 text-orange-500" />
                                <span>{habit.currentStreak}</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="bg-popover text-popover-foreground">
                              <p>Current Streak</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                              <span>
                                <Trophy className="w-4 h-4 text-yellow-500" />
                                <span>{habit.longestStreak}</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="bg-popover text-popover-foreground">
                              <p>Longest Streak</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>

                  <div className="md:hidden">
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-xs text-muted-foreground">
                        {formatDate(today)}
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (habit.completedDates[todayStr]) {
                            untrackHabit(habit._id, todayStr);
                          } else {
                            trackHabit(habit._id, todayStr);
                            jsConfettiRef.current?.addConfetti({
                              emojis: ['✨', '⭐️', '🌟'],
                              emojiSize: 20,
                              confettiNumber: 30,
                            });
                          }
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center ${
                          habit.completedDates[todayStr]
                            ? 'bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600' 
                            : 'bg-background border-muted-foreground hover:bg-green-100 hover:border-green-500'
                        }`}
                        aria-label={habit.completedDates[todayStr] ? 'Completed' : 'Not completed'}
                      >
                        {habit.completedDates[todayStr] && <Check className="h-4 w-4 text-white" />}
                      </Button>
                    </div>
                  </div>

                  <div className="hidden md:flex gap-6">
                    {last5Days.map((date) => {
                      const dateStr = date.toISOString().split('T')[0];
                      const isCompleted = habit.completedDates[dateStr];
                      return (
                        <div key={dateStr} className="flex flex-col items-center gap-1">
                          <div className="text-xs text-muted-foreground">
                            {formatDate(date)}
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isCompleted) {
                                untrackHabit(habit._id, dateStr);
                              } else {
                                trackHabit(habit._id, dateStr);
                                jsConfettiRef.current?.addConfetti({
                                  emojis: ['✨', '⭐️', '🌟'],
                                  emojiSize: 20,
                                  confettiNumber: 30,
                                });
                              }
                            }}
                            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center ${
                              isCompleted 
                                ? 'bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600' 
                                : 'bg-background border-muted-foreground hover:bg-green-100 hover:border-green-500'
                            }`}
                            aria-label={isCompleted ? 'Completed' : 'Not completed'}
                          >
                            {isCompleted && <Check className="h-4 w-4 text-white" />}
                          </Button>
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