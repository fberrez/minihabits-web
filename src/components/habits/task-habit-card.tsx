import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Calendar, Check } from 'lucide-react';
import { Habit } from '../../types/habit';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import JSConfetti from 'js-confetti';
import { useToast } from '../../hooks/use-toast';
import { ToastAction } from '../ui/toast';

interface TaskHabitCardProps {
  habit: Habit;
  localCompletionStatus: Record<string, Record<string, number>>;
  setLocalCompletionStatus: (
    value: React.SetStateAction<Record<string, Record<string, number>>>,
  ) => void;
  onTrack: (habitId: string, date: string) => Promise<void>;
  onUntrack: (habitId: string, date: string) => Promise<void>;
  jsConfettiRef: React.RefObject<JSConfetti>;
  onClick: () => void;
  style?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
}

export function TaskHabitCard({
  habit,
  localCompletionStatus,
  setLocalCompletionStatus,
  onTrack,
  onUntrack,
  jsConfettiRef,
  onClick,
  style,
  titleStyle,
}: TaskHabitCardProps) {
  const today = new Date().toISOString().split('T')[0];
  const isCompleted = localCompletionStatus[habit._id]?.[today] > 0;
  const { toast } = useToast();

  const handleTrack = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompleted) {
      try {
        await onUntrack(habit._id, today);
        setLocalCompletionStatus(prev => ({
          ...prev,
          [habit._id]: { ...prev[habit._id], [today]: 0 },
        }));
      } catch {
        setLocalCompletionStatus(prev => ({
          ...prev,
          [habit._id]: { ...prev[habit._id], [today]: 1 },
        }));
      }
    } else {
      try {
        await onTrack(habit._id, today);
        setLocalCompletionStatus(prev => ({
          ...prev,
          [habit._id]: { ...prev[habit._id], [today]: 1 },
        }));
        jsConfettiRef.current?.addConfetti({
          confettiColors: [habit.color],
        });
        
        toast({
          title: "Task completed!",
          description: `${habit.name} has been marked as done`,
          action: (
            <ToastAction
              altText="Undo"
              onClick={async () => {
                try {
                  await onUntrack(habit._id, today);
                  setLocalCompletionStatus(prev => ({
                    ...prev,
                    [habit._id]: { ...prev[habit._id], [today]: 0 },
                  }));
                } catch {
                  setLocalCompletionStatus(prev => ({
                    ...prev,
                    [habit._id]: { ...prev[habit._id], [today]: 1 },
                  }));
                }
              }}
            >
              Undo
            </ToastAction>
          ),
        });
      } catch {
        setLocalCompletionStatus(prev => ({
          ...prev,
          [habit._id]: { ...prev[habit._id], [today]: 0 },
        }));
      }
    }
  };

  return (
    <Card
      className="transition-all hover:shadow-md hover:translate-x-1 hover:-translate-y-1"
      onClick={onClick}
      style={style}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-8">
          <div className="min-w-[200px] text-left">
            <h2 className="text-xl font-semibold mb-1" style={titleStyle}>
              {habit.name}
            </h2>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              {habit.description && (
                <p className="truncate">{habit.description}</p>
              )}
              {habit.deadline && (
                <span
                  className={cn(
                    'text-xs flex items-center gap-1',
                    new Date(habit.deadline) < new Date()
                      ? 'text-destructive'
                      : 'text-muted-foreground',
                  )}
                >
                  <Calendar className="h-4 w-4" />{format(new Date(habit.deadline), 'MMM d, h:mm a')}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-6 flex-grow justify-end">
            <div className="flex flex-col items-center gap-1">
              <Button
                size="icon"
                variant={isCompleted ? 'default' : 'outline'}
                className="rounded-full w-8 h-8 p-0"
                style={{
                  backgroundColor: isCompleted ? habit.color : undefined,
                  borderColor: habit.color,
                }}
                onClick={handleTrack}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
