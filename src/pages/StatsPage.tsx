import { useHabits } from '../contexts/HabitContext'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card"
import { useNavigate, useParams } from 'react-router-dom'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format, isAfter, startOfDay } from 'date-fns'
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Trash2 } from 'lucide-react'
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
} from "../components/ui/alert-dialog"
import NumberTicker from '../components/ui/number-ticker';

export function StatsPage() {
  const { habitId } = useParams();
  const { habits, trackHabit, untrackHabit, deleteHabit } = useHabits();
  const navigate = useNavigate();

  const habit = habits.find(h => h._id === habitId);
  
  if (!habit) return null;

  const completedDates = Object.keys(habit.completedDates)
    .filter(date => habit.completedDates[date])
    .map(date => new Date(date));

  const handleDayClick = async (day: Date) => {
    if (isAfter(startOfDay(day), startOfDay(new Date()))) {
      return;
    }

    const formattedDate = format(day, 'yyyy-MM-dd');
    const isCompleted = habit.completedDates[formattedDate];
    
    if (isCompleted) {
      await untrackHabit(habit._id, formattedDate);
    } else {
      await trackHabit(habit._id, formattedDate);
    }
  };

  // Prepare data for the chart
  const getChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map(month => ({
      month,
      completions: 0
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
      const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return {
        day: day,
        completed: habit.completedDates[date] ? 1 : 0
      };
    });

    return data;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{habit.name}</h1>
        <div className="flex gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="lg">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Habit</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{habit.name}"? This action cannot be undone.
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
          <Button 
            size="lg" 
            onClick={() => navigate('/')}
          >
            Back to Habits
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <Card>
          <CardContent>
            <DayPicker
              mode="multiple"
              selected={completedDates}
              modifiers={{ completed: completedDates }}
              modifiersStyles={{
                completed: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--background))',
                  fontWeight: '500',
                  transform: 'scale(0.75)' // Makes the circle smaller
                }
              }}
              onDayClick={handleDayClick}
              disabled={[{ after: new Date() }]}
              className="dark:rdp-day_selected:text-background"
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle className="text-center">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <NumberTicker className="text-4xl font-bold text-primary" value={habit.currentStreak} />
            <p className="text-muted-foreground text-center mt-2">days</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle className="text-center">Longest Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <NumberTicker className="text-4xl font-bold text-primary" value={habit.longestStreak} />
            <p className="text-muted-foreground text-center mt-2">days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-8">
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
                              <span className="font-medium">{payload[0].payload.month}</span>
                              <span className="font-medium">{payload[0].value} completions</span>
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
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
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
              Showing daily completions for {new Date().toLocaleString('default', { month: 'long' })}
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
                              <span className="font-medium">Day {payload[0].payload.day}</span>
                              <span className="font-medium">
                                {payload[0].payload.completed ? "Completed" : "Not completed"}
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
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground">
              Daily view for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 