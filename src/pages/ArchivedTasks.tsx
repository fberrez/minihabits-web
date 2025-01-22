import { useHabits } from '../contexts/HabitContext';
import { Card, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { HabitType } from '../types/habit';
import { format } from 'date-fns';

export function ArchivedTasks() {
  const { habits, isLoading } = useHabits();

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex text-left gap-8">
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const archivedTasks = habits.filter(
    habit =>
      habit.type === HabitType.TASK &&
      habit.completedDates[new Date().toISOString().split('T')[0]] > 0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Archived Tasks</h1>
      <div className="space-y-4">
        {archivedTasks.map(task => (
          <Card key={task._id}>
            <CardContent className="p-4">
              <div className="flex text-left justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1 line-through" style={{ color: task.color }}>
                    {task.name}
                  </h2>
                  {task.description && (
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Completed on{' '}
                  {format(
                    new Date(
                      Object.entries(task.completedDates)[0][0]
                    ),
                    'MMM d, yyyy'
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {archivedTasks.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No archived tasks yet
          </div>
        )}
      </div>
    </div>
  );
} 