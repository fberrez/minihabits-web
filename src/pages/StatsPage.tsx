import { useHabits } from '../contexts/HabitContext';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '../components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, isAfter, startOfDay } from 'date-fns';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Trash2, ArrowLeft } from 'lucide-react';
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
} from '../components/ui/alert-dialog';
import NumberTicker from '../components/ui/number-ticker';
import CalHeatmap from 'cal-heatmap';
import CalHeatmapTooltip from 'cal-heatmap/plugins/Tooltip';
import CalHeatmapLabel from 'cal-heatmap/plugins/CalendarLabel';
import 'cal-heatmap/cal-heatmap.css';
import { useEffect, useState } from 'react';
import moment from 'moment';
import './StatsPage.css';
import { getColorRange, HabitType } from '@/types/habit';

export function StatsPage() {
  const { habitId } = useParams();
  const { habits, trackHabit, untrackHabit, deleteHabit } = useHabits();
  const navigate = useNavigate();
  const [localCompletionStatus, setLocalCompletionStatus] = useState<
    Record<string, number>
  >({});

  const habit = habits.find(h => h._id === habitId);

  useEffect(() => {
    if (habit) {
      setLocalCompletionStatus(habit.completedDates);
    }
  }, [habit?._id]);

  useEffect(() => {
    if (!habit) return;

    const cal = new CalHeatmap();
    const data = Object.entries(habit.completedDates).map(
      ([date, completed]) => ({
        date,
        value: habit.type === HabitType.COUNTER ? completed : completed ? 1 : 0,
      }),
    );

    const getData = () => {
      switch (habit.type) {
        case HabitType.COUNTER:
          return { source: data, x: 'date', y: 'value', groupBy: 'max' };
        case HabitType.BOOLEAN:
          return { source: data, x: 'date', y: 'value' };
        default:
          return { source: data, x: 'date', y: 'value' };
      }
    };

    const getScaleColor = () => {
      switch (habit.type) {
        case HabitType.COUNTER:
          return {
            range: getColorRange[habit.color],
            type: 'threshold',
            domain: [
              0.25 * habit.targetCounter,
              0.5 * habit.targetCounter,
              0.75 * habit.targetCounter,
              habit.targetCounter,
            ],
          };
        case HabitType.BOOLEAN:
          return {
            range: ['gray', habit.color],
            interpolate: 'hsl',
            type: 'linear',
            domain: [0, 1],
          };
      }
    };

    const getTooltipText = (
      value: number | null,
      date: { format: (format: string) => string },
    ) => {
      if (habit.type === HabitType.COUNTER) {
        const status =
          value !== null ? `${value} / ${habit.targetCounter}` : 'No data';
        return `${status} on ${date.format('LL')}`;
      }

      const status = value ? 'Completed' : 'No data';
      return `${status} on ${date.format('LL')}`;
    };

    cal.paint(
      {
        data: getData(),
        date: {
          start: moment().utc().startOf('year').toDate(),
          end: moment().utc().endOf('year').toDate(),
        },
        domain: {
          type: 'month',
          sort: 'asc',
          label: { text: 'MMM', textAlign: 'start', position: 'top' },
        },
        subDomain: {
          type: 'ghDay',
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
              dayjsDate: any,
            ) => getTooltipText(value, dayjsDate),
          },
        ],
        [
          CalHeatmapLabel,
          {
            width: 30,
            textAlign: 'start',
            text: () =>
              moment.weekdaysShort().map((d, i) => (i % 2 == 0 ? '' : d)),
            padding: [25, 0, 0, 0],
          },
        ],
      ],
    );

    return () => {
      cal.destroy();
    };
  }, [habit?.completedDates, habit]);

  if (!habit) return null;

  const completedDates = Object.keys(localCompletionStatus)
    .filter(date => localCompletionStatus[date])
    .map(date => new Date(date));

  const handleDayClick = (day: Date) => {
    if (habit.type === HabitType.COUNTER) {
      return;
    }

    if (isAfter(startOfDay(day), startOfDay(new Date()))) {
      return;
    }

    const formattedDate = format(day, 'yyyy-MM-dd');
    const isCompleted = localCompletionStatus[formattedDate];
    setLocalCompletionStatus(prev => ({
      ...prev,
      [formattedDate]: isCompleted ? 0 : 1,
    }));

    if (isCompleted) {
      untrackHabit(habit._id, formattedDate).catch(() => {
        setLocalCompletionStatus(prev => ({
          ...prev,
          [formattedDate]: 1,
        }));
      });
    } else {
      trackHabit(habit._id, formattedDate).catch(() => {
        setLocalCompletionStatus(prev => ({
          ...prev,
          [formattedDate]: 0,
        }));
      });
    }
  };

  // Prepare data for the chart
  const getChartData = () => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const data = months.map(month => ({
      month,
      completions: 0,
    }));

    Object.keys(habit.completedDates).forEach(date => {
      if (habit.completedDates[date]) {
        const monthIndex = new Date(date).getMonth();
        data[monthIndex].completions += 1;
      }
    });

    return data;
  };

  // New function to get current month's data
  const getCurrentMonthData = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const data = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const date = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        '0',
      )}-${String(day).padStart(2, '0')}`;
      return {
        day: day,
        completed: habit.completedDates[date] ? 1 : 0,
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
          <h1 className="text-3xl font-bold">{habit.name}</h1>
        </div>
        <div className="flex gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
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
                    navigate('/');
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="hidden md:block grid grid-cols-1 gap-8">
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
                  color: 'black',
                  fontWeight: '500',
                  transform: 'scale(0.75)',
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
              {habit.currentStreak === 0 ? (
                <p className="text-4xl font-bold">0</p>
              ) : (
                <NumberTicker
                  className="text-4xl font-bold"
                  value={habit.currentStreak}
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
              {habit.longestStreak === 0 ? (
                <p className="text-4xl font-bold">0</p>
              ) : (
                <NumberTicker
                  className="text-4xl font-bold"
                  value={habit.longestStreak}
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
              {habit.completionRate7Days === 0 ? (
                <p className="text-4xl font-bold">0</p>
              ) : (
                <NumberTicker
                  className="text-4xl font-bold"
                  value={Math.round(habit.completionRate7Days)}
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
              {habit.completionRateMonth === 0 ? (
                <p className="text-4xl font-bold">0</p>
              ) : (
                <NumberTicker
                  className="text-4xl font-bold"
                  value={Math.round(habit.completionRateMonth)}
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
              {habit.completionRateYear === 0 ? (
                <p className="text-4xl font-bold">0</p>
              ) : (
                <NumberTicker
                  className="text-4xl font-bold"
                  value={Math.round(habit.completionRateYear)}
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
              Showing daily completions for{' '}
              {new Date().toLocaleString('default', { month: 'long' })}
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
                                  ? 'Completed'
                                  : 'Not completed'}
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
              Daily view for{' '}
              {new Date().toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
