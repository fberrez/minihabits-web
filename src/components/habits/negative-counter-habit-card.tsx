import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Plus, Minus, MoreHorizontal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import JSConfetti from "js-confetti";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { playSuccessSound } from "../../lib/sound";
import { Habit } from "@/api/generated";
interface NegativeCounterHabitCardProps {
  habit: Habit;
  dates: Date[];
  formatDate: (date: Date) => string;
  localCompletionStatus: Record<string, Record<string, number>>;
  setLocalCompletionStatus: (
    value: React.SetStateAction<Record<string, Record<string, number>>>
  ) => void;
  onIncrement: (habitId: string, date: string) => Promise<void>;
  onDecrement: (habitId: string, date: string) => Promise<void>;
  jsConfettiRef: React.RefObject<JSConfetti>;
  style?: React.CSSProperties;
  isHomePage?: boolean;
  showOptions?: boolean;
  glowEffect?: boolean;
}

export function NegativeCounterHabitCard({
  habit,
  dates,
  formatDate,
  localCompletionStatus,
  setLocalCompletionStatus,
  onIncrement,
  onDecrement,
  jsConfettiRef,
  style,
  isHomePage = false,
  showOptions = true,
  glowEffect = false,
}: NegativeCounterHabitCardProps) {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const completionValue =
    localCompletionStatus[habit._id]?.[today] ??
    habit.completedDates[today] ??
    0;
  const isSuccessful = completionValue <= habit.targetCounter;

  return (
    <Card
      className="transition-all"
      style={{
        ...style,
        backgroundColor: isSuccessful ? `${habit.color}20` : undefined,
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-8">
          <div className="min-w-[200px] text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold mb-1">{habit.name}</h2>
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
                      onClick={() => navigate(`/stats/${habit._id}`)}
                    >
                      View stats
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {habit.description && (
                <p className="truncate">{habit.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-6 flex-grow justify-end">
            {dates.map((date) => {
              const formattedDate = date.toISOString().split("T")[0];
              const completionValue =
                localCompletionStatus[habit._id]?.[formattedDate] ??
                habit.completedDates[formattedDate] ??
                0;
              const isSuccessful = completionValue <= habit.targetCounter;

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
                            style={{
                              color: isSuccessful ? habit.color : "#ef4444",
                            }}
                          >
                            {completionValue}/{habit.targetCounter}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="outline"
                              className={cn(
                                "rounded-full w-6 h-6 p-0",
                                glowEffect && !isSuccessful && "animate-glow"
                              )}
                              style={{
                                borderColor: isSuccessful
                                  ? habit.color
                                  : "#ef4444",
                                ...(glowEffect &&
                                  !isSuccessful &&
                                  ({
                                    "--habit-color": habit.color,
                                  } as React.CSSProperties)),
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newValue = Math.max(
                                  0,
                                  completionValue - 1
                                );

                                if (isHomePage) {
                                  setLocalCompletionStatus({
                                    [habit._id]: {
                                      [formattedDate]: newValue,
                                    },
                                  });
                                  if (
                                    !isSuccessful &&
                                    newValue <= habit.targetCounter
                                  ) {
                                    jsConfettiRef.current?.addConfetti({
                                      confettiColors: [habit.color],
                                    });
                                    playSuccessSound();
                                  }
                                  return;
                                }

                                setLocalCompletionStatus((prev) => ({
                                  ...prev,
                                  [habit._id]: {
                                    ...prev[habit._id],
                                    [formattedDate]: newValue,
                                  },
                                }));
                                onDecrement(habit._id, formattedDate).catch(
                                  () => {
                                    setLocalCompletionStatus((prev) => ({
                                      ...prev,
                                      [habit._id]: {
                                        ...prev[habit._id],
                                        [formattedDate]: completionValue,
                                      },
                                    }));
                                  }
                                );
                                if (
                                  !isSuccessful &&
                                  newValue <= habit.targetCounter
                                ) {
                                  jsConfettiRef.current?.addConfetti({
                                    confettiColors: [habit.color],
                                  });
                                  playSuccessSound();
                                }
                              }}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className={cn(
                                "rounded-full w-6 h-6 p-0",
                                glowEffect && !isSuccessful && "animate-glow"
                              )}
                              style={{
                                backgroundColor: !isSuccessful
                                  ? "#ef4444"
                                  : undefined,
                                borderColor: isSuccessful
                                  ? habit.color
                                  : "#ef4444",
                                ...(glowEffect &&
                                  !isSuccessful &&
                                  ({
                                    "--habit-color": habit.color,
                                  } as React.CSSProperties)),
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newValue = completionValue + 1;

                                if (isHomePage) {
                                  setLocalCompletionStatus({
                                    [habit._id]: {
                                      [formattedDate]: newValue,
                                    },
                                  });
                                  return;
                                }

                                setLocalCompletionStatus((prev) => ({
                                  ...prev,
                                  [habit._id]: {
                                    ...prev[habit._id],
                                    [formattedDate]: newValue,
                                  },
                                }));
                                onIncrement(habit._id, formattedDate).catch(
                                  () => {
                                    setLocalCompletionStatus((prev) => ({
                                      ...prev,
                                      [habit._id]: {
                                        ...prev[habit._id],
                                        [formattedDate]: completionValue,
                                      },
                                    }));
                                  }
                                );
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isSuccessful
                        ? `Under limit (${completionValue}/${habit.targetCounter})`
                        : `Over limit (${completionValue}/${habit.targetCounter})`}
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
