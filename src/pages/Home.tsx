import { Button } from "@/components/ui/button";
import { HomeStats } from "@/components/home-stats";
import { useNavigate } from "react-router-dom";
import { BooleanHabitCard } from "@/components/habits/boolean-habit-card";
import { CounterHabitCard } from "@/components/habits/counter-habit-card";
import { TaskHabitCard } from "@/components/habits/task-habit-card";
import { useRef, useState } from "react";
import JSConfetti from "js-confetti";
import { HabitColor, HabitType } from "@/types/habit";
import moment from "moment";
import { AddNewButtons } from "@/components/add-new-buttons";

export function Home() {
  const navigate = useNavigate();
  const jsConfettiRef = useRef<JSConfetti>(new JSConfetti());
  const [currentCard, setCurrentCard] = useState<
    "boolean" | "counter" | "task"
  >("boolean");
  const [localCompletionStatus, setLocalCompletionStatus] = useState<
    Record<string, Record<string, number>>
  >({});
  const [showDescription, setShowDescription] = useState(true);

  type CompletionStatus = typeof localCompletionStatus;

  // Sample habits data for demonstration
  const booleanHabit = {
    _id: "boolean-sample",
    name: "Morning Meditation",
    description: "Start your day with 10 minutes of mindfulness",
    color: HabitColor.BLUE,
    type: HabitType.BOOLEAN,
    completedDates: {},
    targetCounter: 1,
    createdAt: new Date(),
    userId: "demo-user",
    currentStreak: 0,
    longestStreak: 0,
    archived: false,
    archivedAt: null,
    lastCompletedAt: null,
    completionRate7Days: 0,
    completionRateMonth: 0,
    completionRateYear: 0,
  };

  const counterHabit = {
    ...booleanHabit,
    _id: "counter-sample",
    name: "Daily Water Intake",
    description: "Drink 3 glasses of water daily",
    color: HabitColor.TEAL,
    type: HabitType.COUNTER,
    targetCounter: 3,
  };

  const taskHabit = {
    ...booleanHabit,
    _id: "task-sample",
    name: "Weekly Planning",
    description: "Plan your week ahead",
    color: HabitColor.PURPLE,
    type: HabitType.TASK,
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  };

  // Sample dates for the last 3 days
  const dates = [new Date()];

  const descriptions = {
    boolean:
      "Start with simple yes/no habits. Perfect for daily routines like meditation or reading.",
    counter:
      "Track habits with specific targets. Great for water intake, steps, or any countable goal.",
    task: "Set one-time tasks with deadlines. Ideal for important to-dos and weekly planning.",
  };

  return (
    <div className="relative flex items-center justify-center px-4 overflow-hidden min-h-[calc(100vh-3.5rem)]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:items-center mt-8">
          {/* Left Column */}
          <div className="flex flex-col justify-center space-y-8 text-center md:text-left min-h-[calc(100vh-12rem)]">
            <div>
              <HomeStats />
              <h1 className="text-6xl font-bold mb-4 tracking-tighter">
                minihabits.
              </h1>
              <p className="text-lg text-gray-600 max-w-md mx-auto md:mx-0">
                Track your habits and build lasting habits
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="relative"
              >
                Get Started
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                Free to use. No credit card required
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex justify-center pb-24">
            <div className="w-full max-w-md transition-all duration-500 ease-in-out">
              <div className="space-y-4 transition-all duration-500 ease-in-out">
                {currentCard === "boolean" && (
                  <BooleanHabitCard
                    habit={booleanHabit}
                    dates={dates}
                    formatDate={(date) =>
                      date.toLocaleDateString("en-US", { weekday: "short" })
                    }
                    localCompletionStatus={localCompletionStatus}
                    setLocalCompletionStatus={(value) => {
                      setLocalCompletionStatus(value);
                      // Use the newValue directly instead of localCompletionStatus since state updates are async
                      const [date] = dates;
                      const formattedDate = moment(date).format("YYYY-MM-DD");
                      const isCompleted =
                        (value as CompletionStatus)[booleanHabit._id]?.[
                          formattedDate
                        ] > 0;
                      if (isCompleted) {
                        setCurrentCard("counter");
                        setLocalCompletionStatus({});
                      }
                    }}
                    onTrack={async () => {}}
                    onUntrack={async () => {}}
                    jsConfettiRef={jsConfettiRef}
                    isHomePage={true}
                    showOptions={false}
                    glowEffect={true}
                  />
                )}
                {currentCard === "counter" && (
                  <CounterHabitCard
                    habit={counterHabit}
                    dates={dates}
                    formatDate={(date) =>
                      date.toLocaleDateString("en-US", { weekday: "short" })
                    }
                    localCompletionStatus={localCompletionStatus}
                    setLocalCompletionStatus={(value) => {
                      setLocalCompletionStatus(value);
                      const [date] = dates;
                      const formattedDate = moment(date).format("YYYY-MM-DD");
                      const isCompleted =
                        (value as CompletionStatus)[counterHabit._id]?.[
                          formattedDate
                        ] >= counterHabit.targetCounter;
                      if (isCompleted) {
                        setCurrentCard("task");
                        setLocalCompletionStatus({});
                      }
                    }}
                    onIncrement={async () => {}}
                    onDecrement={async () => {}}
                    jsConfettiRef={jsConfettiRef}
                    isHomePage={true}
                    showOptions={false}
                    glowEffect={true}
                  />
                )}
                {currentCard === "task" && (
                  <>
                    {localCompletionStatus[taskHabit._id]?.[
                      moment(dates[0]).format("YYYY-MM-DD")
                    ] > 0 ? (
                      <div className="animate-fade-in">
                        <AddNewButtons
                          showBothButtons={false}
                          redirectToAuth={true}
                        />
                      </div>
                    ) : (
                      <TaskHabitCard
                        habit={taskHabit}
                        localCompletionStatus={localCompletionStatus}
                        setLocalCompletionStatus={(value) => {
                          const newValue =
                            typeof value === "function"
                              ? value(localCompletionStatus)
                              : value;
                          setLocalCompletionStatus(newValue);
                          setShowDescription(false);
                        }}
                        onTrack={async () => {}}
                        onUntrack={async () => {}}
                        jsConfettiRef={jsConfettiRef}
                        showOptions={false}
                        glowEffect={true}
                        activateToast={false}
                      />
                    )}
                  </>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  {showDescription
                    ? descriptions[currentCard]
                    : "Add your first habit now!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
