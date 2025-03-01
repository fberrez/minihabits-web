import { Card, CardContent } from "@/components/ui/card";

import { useHabits } from "@/contexts/HabitContext";
import { Habit, HabitType } from "@/types/habit";
import { isAfter, format } from "date-fns";
import { startOfDay } from "date-fns";
import { useState } from "react";
import { DayPicker } from "react-day-picker";

interface CalendarProps {
  readonly habit: Habit;
}

export default function Calendar({ habit }: CalendarProps) {
  const { trackHabit, untrackHabit } = useHabits();

  const [localCompletionStatus, setLocalCompletionStatus] = useState(
    habit.completedDates
  );

  const completedDates = Object.keys(localCompletionStatus).map(
    (date) => new Date(date)
  );

  const handleDayClick = (day: Date) => {
    if (habit.type === HabitType.COUNTER) {
      return null;
    }

    if (isAfter(startOfDay(day), startOfDay(new Date()))) {
      return;
    }

    const formattedDate = format(day, "yyyy-MM-dd");
    const isCompleted = localCompletionStatus[formattedDate];
    setLocalCompletionStatus((prev) => ({
      ...prev,
      [formattedDate]: isCompleted ? 0 : 1,
    }));

    if (isCompleted) {
      untrackHabit(habit._id, formattedDate).catch(() => {
        setLocalCompletionStatus((prev) => ({
          ...prev,
          [formattedDate]: 1,
        }));
      });
    } else {
      trackHabit(habit._id, formattedDate).catch(() => {
        setLocalCompletionStatus((prev) => ({
          ...prev,
          [formattedDate]: 0,
        }));
      });
    }
  };
  return (
    <Card className="col-span-1 md:col-span-1">
      <CardContent className="flex justify-center items-center">
        <DayPicker
          mode="multiple"
          selected={completedDates}
          modifiers={{ completed: completedDates }}
          modifiersStyles={{
            completed: {
              backgroundColor: habit.color,
              color: "black",
              fontWeight: "500",
              transform: "scale(0.75)",
            },
          }}
          onDayClick={handleDayClick}
          disabled={[{ after: new Date() }]}
          className="mx-auto dark:rdp-day_selected:text-background"
        />
      </CardContent>
    </Card>
  );
}
