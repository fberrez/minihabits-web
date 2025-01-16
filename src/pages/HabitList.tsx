import { useRef, useEffect, useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { Flame, Trophy, Check, Plus } from 'lucide-react';
import JSConfetti from 'js-confetti';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';

export function HabitList() {
  const { habits, isLoading, trackHabit, untrackHabit } = useHabits();
  const navigate = useNavigate();
  const jsConfettiRef = useRef<JSConfetti | null>(null);
  const [localCompletionStatus, setLocalCompletionStatus] = useState<
    Record<string, Record<string, number>>
  >({});

  useEffect(() => {
    jsConfettiRef.current = new JSConfetti();
  }, []);

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
    <>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">minihabits.</h1>
          <div className="flex gap-4">
            <Button
              size="icon"
              onClick={() => navigate('/new')}
              className="add-habit-button"
            >
              <Plus className="inline h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4 habit-list">
          {habits.map(habit => {
            if (!localCompletionStatus[habit._id]) {
              setLocalCompletionStatus(prev => ({
                ...prev,
                [habit._id]: { ...habit.completedDates },
              }));
            }

            return (
              <Card
                key={habit._id}
                className="cursor-pointer transition-all hover:shadow-md hover:translate-x-1 hover:-translate-y-1"
                onClick={() => navigate(`/stats/${habit._id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-8">
                    <div className="min-w-[200px] text-left">
                      <h2 className="text-xl font-semibold mb-1">
                        {habit.name}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground habit-stats">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                <Flame className="inline h-4 w-4 text-orange-500" />
                                <span>{habit.currentStreak}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Current Streak</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                <Trophy className="inline h-4 w-4 text-yellow-500" />
                                <span>{habit.longestStreak}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Longest Streak</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <div className="flex gap-6 flex-grow justify-end">
                      {getLast5Days().map(date => {
                        const formattedDate = date.toISOString().split('T')[0];
                        const isCompleted =
                          localCompletionStatus[habit._id]?.[formattedDate] ??
                          habit.completedDates[formattedDate];

                        return (
                          <TooltipProvider key={date.toISOString()}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(date)}
                                  </span>
                                  <Button
                                    size="icon"
                                    variant={
                                      isCompleted ? 'default' : 'outline'
                                    }
                                    className="rounded-full w-8 h-8 p-0"
                                    style={{
                                      backgroundColor: isCompleted
                                        ? habit.color
                                        : undefined,
                                      borderColor: habit.color,
                                    }}
                                    onClick={e => {
                                      e.stopPropagation();
                                      setLocalCompletionStatus(prev => ({
                                        ...prev,
                                        [habit._id]: {
                                          ...prev[habit._id],
                                          [formattedDate]: isCompleted ? 0 : 1,
                                        },
                                      }));

                                      if (isCompleted) {
                                        untrackHabit(
                                          habit._id,
                                          formattedDate,
                                        ).catch(() => {
                                          setLocalCompletionStatus(prev => ({
                                            ...prev,
                                            [habit._id]: {
                                              ...prev[habit._id],
                                              [formattedDate]: 0,
                                            },
                                          }));
                                        });
                                      } else {
                                        trackHabit(
                                          habit._id,
                                          formattedDate,
                                        ).catch(() => {
                                          setLocalCompletionStatus(prev => ({
                                            ...prev,
                                            [habit._id]: {
                                              ...prev[habit._id],
                                              [formattedDate]: 0,
                                            },
                                          }));
                                        });
                                        jsConfettiRef.current?.addConfetti({
                                          confettiColors: [habit.color],
                                        });
                                      }
                                    }}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {isCompleted ? 'Completed' : 'Not completed'}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
    </>
  );
}
