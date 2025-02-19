import { getColorRange, HabitType, HabitStat } from "@/types/habit";
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import CalHeatmapLabel from "cal-heatmap/plugins/CalendarLabel";
import CalHeatmapTooltip from "cal-heatmap/plugins/Tooltip";
import { format, isAfter, startOfDay } from "date-fns";
import { ArrowLeft, Trash2 } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import NumberTicker from "../components/ui/number-ticker";
import { useHabits } from "../contexts/HabitContext";
import "./StatsPage.css";
import { useToast } from "../hooks/use-toast";

export function StatsPage() {
  const { habitId } = useParams();
  const { habits, trackHabit, untrackHabit, deleteHabit, getStats } =
    useHabits();
  const navigate = useNavigate();
  const [localCompletionStatus, setLocalCompletionStatus] = useState<
    Record<string, number>
  >({});
  const [habitStats, setHabitStats] = useState<HabitStat | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const habit = habits.find((h) => h._id === habitId);
  const [isEditing, setIsEditing] = useState(false);
  const [habitTitle, setHabitTitle] = useState("");

  const { toast } = useToast();
  const updateHabit = useHabits().updateHabit;

  useEffect(() => {
    const fetchStats = async () => {
      if (!habit) return;

      try {
        const statsData = await getStats([habit._id]);
        const habitStat = statsData.habits.find((h) => h.name === habit.name);
        if (habitStat) {
          setHabitStats(habitStat);
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch habit stats",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [habit, toast]);

  const handleEditClick = async () => {
    setIsEditing(!isEditing);

    if (isEditing) {
      try {
        updateHabit(habit!._id, { name: habitTitle });
        toast({
          title: "Habit Modified",
          description: "New habit title saved successfully",
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to update habit title",
          variant: "destructive",
        });
      }
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHabitTitle(e.target.value);
  };

  useEffect(() => {
    if (habit) {
      setLocalCompletionStatus(habit.completedDates);
      setHabitTitle(habit.name);
    }
  }, [habit, habit?._id]);

  useEffect(() => {
    if (!habit) return;

    const cal = new CalHeatmap();
    const currentDate = new Date();
    const startDate = moment().utc().startOf("year").toDate();

    // Generate data for all dates
    const generateAllDates = () => {
      const dates = [];
      const current = new Date(startDate);

      while (current <= currentDate) {
        const dateStr = format(current, "yyyy-MM-dd");
        const value = habit.completedDates[dateStr];

        dates.push({
          date: dateStr,
          value: value === undefined ? 0 : value,
        });

        current.setDate(current.getDate() + 1);
      }

      return dates;
    };

    const getData = () => {
      // For negative habits, we need data for all dates
      const allData =
        habit.type === HabitType.NEGATIVE_BOOLEAN ||
        habit.type === HabitType.NEGATIVE_COUNTER
          ? generateAllDates()
          : Object.entries(habit.completedDates).map(([date, completed]) => ({
              date,
              value: completed,
            }));

      switch (habit.type) {
        case HabitType.COUNTER:
          return { source: allData, x: "date", y: "value", groupBy: "max" };
        case HabitType.NEGATIVE_COUNTER:
          return {
            source: allData.map((d) => ({
              ...d,
              // For negative counter, we want to show the ratio to target
              // If no value, it's a perfect score (1)
              // If has value, we calculate how close to target (or above) we are
              value:
                d.value === undefined
                  ? 1
                  : Math.max(0, 1 - d.value / (habit.targetCounter || 1)),
            })),
            x: "date",
            y: "value",
          };
        case HabitType.BOOLEAN:
          return { source: allData, x: "date", y: "value" };
        case HabitType.NEGATIVE_BOOLEAN:
          return {
            source: allData.map((d) => ({
              ...d,
              value: d.value === 0 ? 1 : 0,
            })),
            x: "date",
            y: "value",
          };
        default:
          return { source: allData, x: "date", y: "value" };
      }
    };

    const getScaleColor = () => {
      switch (habit.type) {
        case HabitType.COUNTER:
          return {
            range: getColorRange[habit.color],
            type: "threshold",
            domain: [
              0.25 * habit.targetCounter,
              0.5 * habit.targetCounter,
              0.75 * habit.targetCounter,
              habit.targetCounter,
            ],
          };
        case HabitType.NEGATIVE_COUNTER:
          return {
            range: getColorRange[habit.color],
            type: "threshold",
            domain: [0.25, 0.5, 0.75, 1],
          };
        case HabitType.BOOLEAN:
          return {
            range: ["gray", habit.color],
            interpolate: "hsl",
            type: "linear",
            domain: [0, 1],
          };
        case HabitType.NEGATIVE_BOOLEAN:
          return {
            range: ["red", habit.color],
            interpolate: "hsl",
            type: "linear",
            domain: [0, 1],
          };
      }
    };

    const getTooltipText = (
      value: number | null,
      date: { format: (format: string) => string }
    ) => {
      if (habit.type === HabitType.COUNTER) {
        const status =
          value !== null ? `${value} / ${habit.targetCounter}` : "No data";
        return `${status} on ${date.format("LL")}`;
      }

      if (habit.type === HabitType.NEGATIVE_COUNTER) {
        const rawValue = habit.completedDates[date.format("YYYY-MM-DD")];
        const status =
          rawValue === undefined
            ? "Perfect (no data)"
            : `${rawValue} / ${habit.targetCounter}`;
        return `${status} on ${date.format("LL")}`;
      }

      const status = value ? "Completed" : "No data";
      return `${status} on ${date.format("LL")}`;
    };

    cal.paint(
      {
        data: getData(),
        date: {
          start: moment().utc().startOf("year").toDate(),
          end: moment().utc().endOf("year").toDate(),
        },
        domain: {
          type: "month",
          sort: "asc",
          label: { text: "MMM", textAlign: "start", position: "top" },
        },
        subDomain: {
          type: "ghDay",
          radius: 2,
          width: 12,
          height: 12,
          gutter: 4,
        },
        scale: {
          color: getScaleColor(),
        },
      },
      [
        [
          CalHeatmapTooltip,
          {
            text: (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              _: any,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              value: any,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              dayjsDate: any
            ) => getTooltipText(value, dayjsDate),
          },
        ],
        [
          CalHeatmapLabel,
          {
            width: 30,
            textAlign: "start",
            text: () =>
              moment.weekdaysShort().map((d, i) => (i % 2 == 0 ? "" : d)),
            padding: [25, 0, 0, 0],
          },
        ],
      ]
    );

    return () => {
      cal.destroy();
    };
  }, [habit?.completedDates, habit]);

  if (!habit || isLoading) return null;

  const stats = habitStats || {
    name: habit.name,
    type: habit.type,
    targetCounter: habit.targetCounter,
    currentStreak: 0,
    longestStreak: 0,
    completions: 0,
    completionRate7Days: 0,
    completionRateMonth: 0,
    completionRateYear: 0,
  };

  const completedDates = Object.keys(localCompletionStatus)
    .filter((date) => localCompletionStatus[date])
    .map((date) => new Date(date));

  const handleDayClick = (day: Date) => {
    if (habit.type === HabitType.COUNTER) {
      return;
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

  // Prepare data for the chart
  const getChartData = () => {
    if (!stats || !habitStats) return [];

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get the current year
    const currentYear = new Date().getFullYear();
    const currentDate = new Date();
    const data = months.map((month, index) => {
      // Get the first day of the month
      const date = new Date(currentYear, index, 1);
      const monthKey = format(date, "yyyy-MM");

      // For negative habits, if there's no entry for a date, it means the habit was successfully avoided
      let monthCompletions = 0;
      if (
        habit.type === HabitType.NEGATIVE_BOOLEAN ||
        habit.type === HabitType.NEGATIVE_COUNTER
      ) {
        // Get the number of days in the month
        const daysInMonth = new Date(currentYear, index + 1, 0).getDate();
        // For each day in the month
        for (let day = 1; day <= daysInMonth; day++) {
          // Skip days after current date for current month
          if (index === currentDate.getMonth() && day > currentDate.getDate()) {
            continue;
          }
          // Skip future months entirely
          if (index > currentDate.getMonth()) {
            break;
          }

          const dateStr = format(
            new Date(currentYear, index, day),
            "yyyy-MM-dd"
          );
          const value = habit.completedDates[dateStr];

          // If no value exists, or value meets success criteria, count as completion
          if (
            value === undefined ||
            (habit.type === HabitType.NEGATIVE_BOOLEAN && value === 0) ||
            (habit.type === HabitType.NEGATIVE_COUNTER &&
              (value === undefined || value <= habit.targetCounter))
          ) {
            monthCompletions++;
          }
        }
      } else {
        // For regular habits, count actual completions
        monthCompletions = Object.entries(habit.completedDates).filter(
          ([date, value]) => {
            const [yearMonth] = date.split("-");
            return yearMonth === monthKey && value > 0;
          }
        ).length;
      }

      return {
        month,
        completions: monthCompletions,
      };
    });

    return data;
  };

  // Get current month's data
  const getCurrentMonthData = () => {
    if (!stats || !habitStats) return [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentDay = now.getDate();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const data = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;

      // Skip days after current date for negative habits
      if (
        (habit.type === HabitType.NEGATIVE_BOOLEAN ||
          habit.type === HabitType.NEGATIVE_COUNTER) &&
        day > currentDay
      ) {
        return {
          day,
          completed: 0,
        };
      }

      const date = format(
        new Date(currentYear, currentMonth, day),
        "yyyy-MM-dd"
      );
      const value = habit.completedDates[date];

      let completed = 0;
      if (
        habit.type === HabitType.NEGATIVE_BOOLEAN ||
        habit.type === HabitType.NEGATIVE_COUNTER
      ) {
        // For negative habits, no entry means success
        if (habit.type === HabitType.NEGATIVE_BOOLEAN) {
          completed = value === undefined || value === 0 ? 1 : 0;
        } else {
          // For negative counter, success is when value is undefined or less than target
          completed =
            value === undefined || value <= habit.targetCounter ? 1 : 0;
        }
      } else {
        // For regular habits, success is when value > 0
        completed = value > 0 ? 1 : 0;
      }

      return {
        day,
        completed,
      };
    });

    return data;
  };
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: habit.color }}
          />
          {isEditing ? (
            <input
              type="text"
              value={habitTitle}
              onChange={handleTitleChange}
              onBlur={handleEditClick}
              autoFocus
              spellCheck="true"
              className="text-3xl font-bold ring-1 ring-blue-600 rounded-lg px-2 py-0.5"
            />
          ) : (
            <h1
              className="text-3xl font-bold px-2 py-0.5 cursor-pointer hover:bg-gray-50 transition-all rounded-lg"
              onClick={handleEditClick}
            >
              {habitTitle}
            </h1>
          )}
        </div>
        <div className="flex gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Habit</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{habit.name}"? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await deleteHabit(habit._id);
                    navigate("/");
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="md:block grid grid-cols-1 gap-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Yearly Heatmap</CardTitle>
            <CardDescription>
              Your habit completion throughout the year
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div id="cal-heatmap" className="w-full flex justify-center"></div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

        <Card className="flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle className="text-center">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ color: habit.color }}>
              {stats.currentStreak === 0 ? (
                <p className="text-4xl font-bold">0</p>
              ) : (
                <NumberTicker
                  className="text-4xl font-bold"
                  value={stats.currentStreak}
                />
              )}
            </div>
            <p className="text-muted-foreground text-center mt-2">days</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle className="text-center">Longest Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ color: habit.color }}>
              {stats.longestStreak === 0 ? (
                <p className="text-4xl font-bold">0</p>
              ) : (
                <NumberTicker
                  className="text-4xl font-bold"
                  value={stats.longestStreak}
                />
              )}
            </div>
            <p className="text-muted-foreground text-center mt-2">days</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle className="text-center">Completion Rate</CardTitle>
            <CardDescription className="text-center">
              Last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ color: habit.color }}>
              {stats.completionRate7Days === 0 ? (
                <p className="text-4xl font-bold">0</p>
              ) : (
                <NumberTicker
                  className="text-4xl font-bold"
                  value={Math.round(stats.completionRate7Days)}
                />
              )}
            </div>
            <p className="text-muted-foreground text-center mt-2">%</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle className="text-center">Monthly Rate</CardTitle>
            <CardDescription className="text-center">
              This month (completed days only)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ color: habit.color }}>
              {stats.completionRateMonth === 0 ? (
                <p className="text-4xl font-bold">0</p>
              ) : (
                <NumberTicker
                  className="text-4xl font-bold"
                  value={Math.round(stats.completionRateMonth)}
                />
              )}
            </div>
            <p className="text-muted-foreground text-center mt-2">%</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle className="text-center">Yearly Rate</CardTitle>
            <CardDescription className="text-center">
              This year (completed days only)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ color: habit.color }}>
              {stats.completionRateYear === 0 ? (
                <p className="text-4xl font-bold">0</p>
              ) : (
                <NumberTicker
                  className="text-4xl font-bold"
                  value={Math.round(stats.completionRateYear)}
                />
              )}
            </div>
            <p className="text-muted-foreground text-center mt-2">%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Yearly Overview</CardTitle>
            <CardDescription>
              Showing daily completions throughout the year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={getChartData()}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <span className="font-medium">
                                {payload[0].payload.month}
                              </span>
                              <span className="font-medium">
                                {payload[0].value} completions
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completions"
                    stroke={habit.color}
                    fill={habit.color}
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground">
              Showing completion rate for {new Date().getFullYear()}
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
            <CardDescription>
              Showing daily completions for{" "}
              {new Date().toLocaleString("default", { month: "long" })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={getCurrentMonthData()}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval="preserveStartEnd"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <span className="font-medium">
                                Day {payload[0].payload.day}
                              </span>
                              <span className="font-medium">
                                {payload[0].payload.completed
                                  ? "Completed"
                                  : "Not completed"}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="step"
                    dataKey="completed"
                    stroke={habit.color}
                    fill={habit.color}
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground">
              Daily view for{" "}
              {new Date().toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
