import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Check } from 'lucide-react';
import { Habit } from '../../types/habit';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import JSConfetti from 'js-confetti';

interface BooleanHabitCardProps {
  habit: Habit;
  dates: Date[];
  formatDate: (date: Date) => string;
  localCompletionStatus: Record<string, Record<string, number>>;
  setLocalCompletionStatus: (
    value: React.SetStateAction<Record<string, Record<string, number>>>,
  ) => void;
  onTrack: (habitId: string, date: string) => Promise<void>;
  onUntrack: (habitId: string, date: string) => Promise<void>;
  jsConfettiRef: React.RefObject<JSConfetti>;
  onClick: () => void;
  style?: React.CSSProperties;
}

export function BooleanHabitCard({
  habit,
  dates,
  formatDate,
  localCompletionStatus,
  setLocalCompletionStatus,
  onTrack,
  onUntrack,
  jsConfettiRef,
  onClick,
  style,
}: BooleanHabitCardProps) {
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
              const isCompleted =
                (localCompletionStatus[habit._id]?.[formattedDate] ??
                  habit.completedDates[formattedDate] ??
                  0) > 0;

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
                          variant={isCompleted ? 'default' : 'outline'}
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
                              onUntrack(habit._id, formattedDate).catch(() => {
                                setLocalCompletionStatus(prev => ({
                                  ...prev,
                                  [habit._id]: {
                                    ...prev[habit._id],
                                    [formattedDate]: 1,
                                  },
                                }));
                              });
                            } else {
                              onTrack(habit._id, formattedDate).catch(() => {
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
}
