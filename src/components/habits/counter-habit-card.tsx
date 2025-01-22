import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Plus, Minus } from 'lucide-react';
import { Habit } from '../../types/habit';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import JSConfetti from 'js-confetti';

interface CounterHabitCardProps {
  habit: Habit;
  dates: Date[];
  formatDate: (date: Date) => string;
  localCompletionStatus: Record<string, Record<string, number>>;
  setLocalCompletionStatus: (
    value: React.SetStateAction<Record<string, Record<string, number>>>,
  ) => void;
  onIncrement: (habitId: string, date: string) => Promise<void>;
  onDecrement: (habitId: string, date: string) => Promise<void>;
  jsConfettiRef: React.RefObject<JSConfetti>;
  onClick: () => void;
  style?: React.CSSProperties;
}

export function CounterHabitCard({
  habit,
  dates,
  formatDate,
  localCompletionStatus,
  setLocalCompletionStatus,
  onIncrement,
  onDecrement,
  jsConfettiRef,
  onClick,
  style,
}: CounterHabitCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:translate-x-1 hover:-translate-y-1 group"
      onClick={onClick}
      style={style}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-8">
          <div className="min-w-[200px] text-left">
            <h2 className="text-xl font-semibold mb-1 group-hover:underline decoration-2">
              {habit.name}
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {habit.description && (
                <p className="truncate">{habit.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-6 flex-grow justify-end">
            {dates.map(date => {
              const formattedDate = date.toISOString().split('T')[0];
              const completionValue =
                localCompletionStatus[habit._id]?.[formattedDate] ??
                habit.completedDates[formattedDate] ??
                0;
              const isCompleted = completionValue >= habit.targetCounter;

              return (
                <TooltipProvider key={date.toISOString()}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(date)}
                        </span>
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className="text-sm font-medium"
                            style={{ color: habit.color }}
                          >
                            {completionValue}/{habit.targetCounter}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="outline"
                              className="rounded-full w-6 h-6 p-0"
                              style={{ borderColor: habit.color }}
                              onClick={e => {
                                e.stopPropagation();
                                const newValue = Math.max(
                                  0,
                                  completionValue - 1,
                                );
                                setLocalCompletionStatus(prev => ({
                                  ...prev,
                                  [habit._id]: {
                                    ...prev[habit._id],
                                    [formattedDate]: newValue,
                                  },
                                }));
                                onDecrement(habit._id, formattedDate).catch(
                                  () => {
                                    setLocalCompletionStatus(prev => ({
                                      ...prev,
                                      [habit._id]: {
                                        ...prev[habit._id],
                                        [formattedDate]: completionValue,
                                      },
                                    }));
                                  },
                                );
                              }}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="rounded-full w-6 h-6 p-0"
                              style={{
                                backgroundColor: isCompleted
                                  ? habit.color
                                  : undefined,
                                borderColor: habit.color,
                              }}
                              onClick={e => {
                                e.stopPropagation();
                                const newValue = completionValue + 1;
                                setLocalCompletionStatus(prev => ({
                                  ...prev,
                                  [habit._id]: {
                                    ...prev[habit._id],
                                    [formattedDate]: newValue,
                                  },
                                }));
                                onIncrement(habit._id, formattedDate).catch(
                                  () => {
                                    setLocalCompletionStatus(prev => ({
                                      ...prev,
                                      [habit._id]: {
                                        ...prev[habit._id],
                                        [formattedDate]: completionValue,
                                      },
                                    }));
                                  },
                                );
                                if (newValue >= habit.targetCounter) {
                                  jsConfettiRef.current?.addConfetti({
                                    confettiColors: [habit.color],
                                  });
                                }
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {`${completionValue}/${habit.targetCounter} completed`}
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
}
