import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHabits } from "../contexts/HabitContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { HabitColor, HabitType, Habit } from "../types/habit";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Lightbulb, CalendarIcon } from "lucide-react";
import { format, add } from "date-fns";
import { cn } from "../lib/utils";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { ColorPicker } from "../components/color-picker";
import { TimePicker } from "@/components/ui/time-picker";
import moment from "moment";

const getRandomColor = () => {
  const colors = Object.values(HabitColor);
  return colors[Math.floor(Math.random() * colors.length)];
};

interface NewTaskProps {
  initialData?: Habit;
}

export function NewTask({ initialData }: NewTaskProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || "");
  const [color, setColor] = useState<HabitColor>(initialData?.color || getRandomColor());
  const [description, setDescription] = useState(initialData?.description || "");
  const [deadline, setDeadline] = useState<Date | null>(
    initialData 
      ? (initialData.deadline ? new Date(initialData.deadline) : null)
      : moment().add(1, 'day').hour(12).minute(0).second(0).toDate()
  );
  const { createHabit, updateHabit } = useHabits();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !color) {
      toast({
        title: "Missing required fields",
        description: "Please provide both a task name and select a color.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (initialData) {
        console.log(initialData.description, description);
        await updateHabit(
          initialData._id,
          {
            name,
            color,
            description,
            deadline,
          }
        );
        toast({
          title: "Task updated",
          description: "Your task has been updated successfully.",
        });
      } else {
        await createHabit(
          name,
          color,
          HabitType.TASK,
          undefined,
          description,
          deadline
        );
        toast({
          title: "Task created",
          description: "Your new task has been created successfully.",
        });
      }
      navigate("/");
    } catch (error) {
      console.error("Failed to create task:", error);
      toast({
        title: "Error",
        description: `Failed to ${initialData ? 'update' : 'create'} task. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDateTime = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!deadline) {
      setDeadline(newDay);
      return;
    }
    const diff = newDay.getTime() - deadline.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(deadline, { days: Math.ceil(diffInDays) });
    setDeadline(newDateFull);
  };

  return (
    <div className="max-w-[2000px] mx-auto px-8 py-8">
      <Card className="max-w-[600px] mx-auto">
        <CardHeader>
          <CardTitle>{initialData ? 'Edit task' : 'Create a new task'}</CardTitle>
          <CardDescription>
            {initialData 
              ? 'Update your task details, deadline, or description.'
              : 'Add a one-time task with an optional deadline and description.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Task Tip:</strong> Break down large tasks into smaller,
              manageable steps. A well-defined task is easier to complete.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="name">Task name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Submit project proposal"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your task..."
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="h-6">Deadline (optional)</Label>
                {deadline && (
                  <Button
                    variant="ghost"
                    onClick={() => setDeadline(null)}
                    className="h-6 w-6 p-0 hover:bg-transparent"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? (
                        format(deadline, "PPP HH:mm:ss")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={deadline || moment().hour(12).minute(0).second(0).toDate()}
                      onSelect={(d) => handleSelectDateTime(d)}
                      classNames={{
                        day_outside: "text-muted-foreground opacity-50",
                      }}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <TimePicker 
                        setDate={(date) => setDeadline(date || null)} 
                        date={deadline || moment().hour(12).minute(0).second(0).toDate()} 
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <ColorPicker
              value={color}
              onChange={(value: HabitColor) => setColor(value)}
              disabled={isLoading}
            />
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
            {isLoading 
              ? (initialData ? "Updating..." : "Creating...") 
              : (initialData ? "Update Task" : "Create Task")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
