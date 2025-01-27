import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Calendar, Check, MoreHorizontal } from "lucide-react";
import { Habit } from "../../types/habit";
import { cn } from "../../lib/utils";
import { format } from "date-fns";
import JSConfetti from "js-confetti";
import { useToast } from "../../hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { useHabits } from "../../contexts/HabitContext";

interface TaskHabitCardProps {
  habit: Habit;
  localCompletionStatus: Record<string, Record<string, number>>;
  setLocalCompletionStatus: (
    value: React.SetStateAction<Record<string, Record<string, number>>>
  ) => void;
  onTrack: (habitId: string, date: string) => Promise<void>;
  onUntrack: (habitId: string, date: string) => Promise<void>;
  jsConfettiRef: React.RefObject<JSConfetti>;
  style?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  showOptions?: boolean;
  glowEffect?: boolean;
  activateToast?: boolean;
}

export function TaskHabitCard({
  habit,
  localCompletionStatus,
  setLocalCompletionStatus,
  onTrack,
  onUntrack,
  jsConfettiRef,
  style,
  titleStyle,
  showOptions = true,
  glowEffect = false,
  activateToast = true,
}: TaskHabitCardProps) {
  const today = new Date().toISOString().split("T")[0];
  const isCompleted = localCompletionStatus[habit._id]?.[today] > 0;
  const { toast } = useToast();
  const navigate = useNavigate();
  const { deleteHabit } = useHabits();

  const handleTrack = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompleted) {
      try {
        setLocalCompletionStatus((prev) => ({
          ...prev,
          [habit._id]: { ...prev[habit._id], [today]: 0 },
        }));
        await onUntrack(habit._id, today);
      } catch {
        setLocalCompletionStatus((prev) => ({
          ...prev,
          [habit._id]: { ...prev[habit._id], [today]: 1 },
        }));
      }
    } else {
      try {
        setLocalCompletionStatus((prev) => ({
          ...prev,
          [habit._id]: { ...prev[habit._id], [today]: 1 },
        }));
        jsConfettiRef.current?.addConfetti({
          confettiColors: [habit.color],
        });
        await onTrack(habit._id, today);

        if (activateToast) {
          toast({
            title: "Task completed!",
            description: `${habit.name} has been marked as done`,
            action: (
              <ToastAction
                altText="Undo"
                onClick={async () => {
                  try {
                    await onUntrack(habit._id, today);
                    setLocalCompletionStatus((prev) => ({
                      ...prev,
                      [habit._id]: { ...prev[habit._id], [today]: 0 },
                    }));
                  } catch {
                    setLocalCompletionStatus((prev) => ({
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
        }
      } catch {
        setLocalCompletionStatus((prev) => ({
          ...prev,
          [habit._id]: { ...prev[habit._id], [today]: 0 },
        }));
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHabit(habit._id);
      toast({
        title: "Task deleted",
        description: `${habit.name} has been deleted successfully`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card
      className="transition-all hover:shadow-md hover:translate-x-1 hover:-translate-y-1"
      style={{
        ...style,
        backgroundColor: isCompleted ? `${habit.color}20` : undefined,
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-8">
          <div className="min-w-[200px] text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold mb-1" style={titleStyle}>
                {habit.name}
              </h2>
              {showOptions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 hover:bg-transparent"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate(`/edit-task/${habit._id}`)}
                    >
                      Edit task
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      Delete task
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              {habit.description && (
                <p className="truncate">{habit.description}</p>
              )}
              {habit.deadline && (
                <span
                  className={cn(
                    "text-xs flex items-center gap-1",
                    new Date(habit.deadline) < new Date()
                      ? "text-destructive"
                      : "text-muted-foreground"
                  )}
                >
                  <Calendar className="h-4 w-4" />
                  {format(new Date(habit.deadline), "MMM d, h:mm a")}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-6 flex-grow justify-end">
            <div className="flex flex-col items-center gap-1">
              <Button
                size="icon"
                variant={isCompleted ? "default" : "outline"}
                className={cn(
                  "rounded-full w-8 h-8 p-0",
                  glowEffect && !isCompleted && "animate-glow"
                )}
                style={{
                  backgroundColor: isCompleted ? habit.color : undefined,
                  borderColor: habit.color,
                  ...(glowEffect &&
                    !isCompleted &&
                    ({
                      "--habit-color": habit.color,
                    } as React.CSSProperties)),
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
