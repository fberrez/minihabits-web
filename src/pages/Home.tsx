import { Button } from "../components/ui/button";
import { HomeStats } from "@/components/home-stats";
import { useNavigate } from "react-router-dom";
import { BooleanHabitCard } from "@/components/habits/boolean-habit-card";
import { CounterHabitCard } from "@/components/habits/counter-habit-card";
import { useEffect, useRef, useState } from "react";
import JSConfetti from "js-confetti";
import { HabitColor, HabitType } from "../api/types/appTypes";
import moment from "moment";
import { Card, CardContent } from "../components/ui/card";
import { AddNewButtons } from "@/components/add-new-buttons";
import { ChevronDown, Lock, Shield, CirclePlus } from "lucide-react";
import FlickeringGrid from "@/components/ui/flickering-grid";
import { useTheme } from "@/components/theme-provider";
import { Habit } from "@/api/generated";
import BooleanHeatmap from "@/components/stats/boolean/BooleanHeatmap";
import {
  CompletionRateCard,
  CurrentStreakCard,
  LongestStreakCard,
} from "@/components/stats";

export function Home() {
  const navigate = useNavigate();
  const jsConfettiRef = useRef<JSConfetti>(new JSConfetti());
  const [currentCard, setCurrentCard] = useState<"boolean" | "counter">(
    "boolean"
  );
  const [localCompletionStatus, setLocalCompletionStatus] = useState<
    Record<string, Record<string, number>>
  >({});
  const [showDescription, setShowDescription] = useState(true);
  const { theme } = useTheme();
  const [showScrollButton, setShowScrollButton] = useState(true);
  const heroSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollButton(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (heroSectionRef.current) {
      observer.observe(heroSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  type CompletionStatus = typeof localCompletionStatus;

  // Sample habits data for demonstration
  const booleanHabit: Habit & {
    completionRate7Days?: number;
    completionRateMonth?: number;
    completionRateYear?: number;
  } = {
    _id: "boolean-sample",
    name: "Morning Meditation",
    description: "Start your day with 10 minutes of mindfulness",
    color: HabitColor.BLUE,
    type: HabitType.BOOLEAN,
    completedDates: {},
    targetCounter: 1,
    createdAt: new Date().toISOString(),
    userId: "demo-user",
    currentStreak: 14,
    longestStreak: 20,
    completionRate7Days: 100,
    completionRateMonth: 100,
    completionRateYear: 100,
  };

  // Generate completed dates for the last 30 days
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    // Randomly mark some days as completed
    booleanHabit.completedDates[dateStr] = Math.random() < 0.7;
  }

  const counterHabit = {
    ...booleanHabit,
    _id: "counter-sample",
    name: "Daily Water Intake",
    description: "Drink 3 glasses of water daily",
    color: HabitColor.TEAL,
    type: HabitType.COUNTER,
    targetCounter: 3,
  };

  // Sample dates for the last 3 days
  const dates = [new Date()];

  const descriptions = {
    boolean:
      "Start with simple yes/no habits. Perfect for daily routines like meditation or reading.",
    counter:
      "Track habits with specific targets. Great for water intake, steps, or any countable goal.",
  };

  const scrollToNextSection = () => {
    const nextSection = document.querySelector("section:nth-of-type(2)");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section
        ref={heroSectionRef}
        className="min-h-[calc(100vh-3.5rem)] flex items-center relative"
      >
        <FlickeringGrid
          className="absolute inset-0 z-0 hidden md:block [mask-image:radial-gradient(1000px_800px_at_top,white,transparent)]"
          squareSize={12}
          gridGap={4}
          color={theme === "dark" ? "#ffffff" : "#000000"}
          maxOpacity={0.5}
          flickerChance={0.05}
          height={2000}
          width={2000}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:items-center">
            {/* Left Column */}
            <div className="flex flex-col justify-center space-y-8 text-center md:text-left">
              <div className="relative">
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
            <div className="flex justify-center">
              <div className="w-full max-w-md transition-all duration-500 ease-in-out">
                <div className="space-y-4 transition-all duration-500 ease-in-out">
                  {/* Arrow and text */}
                  <div className="hidden md:flex justify-end mb-2">
                    <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                      <p className="text-sm font-medium">Try it!</p>
                      <svg
                        className="w-4 h-4 text-primary transform rotate-90 animated-bounce"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </div>
                  {currentCard === "boolean" && (
                    <div className="relative">
                      <BooleanHabitCard
                        habit={booleanHabit}
                        dates={dates}
                        formatDate={(date) =>
                          date.toLocaleDateString("en-US", { weekday: "short" })
                        }
                        localCompletionStatus={localCompletionStatus}
                        setLocalCompletionStatus={(value) => {
                          setLocalCompletionStatus(value);
                          const [date] = dates;
                          const formattedDate =
                            moment(date).format("YYYY-MM-DD");
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
                    </div>
                  )}
                  {currentCard === "counter" && !showDescription && (
                    <div className="animate-fade-in w-full">
                      <AddNewButtons redirectToAuth={true} />
                    </div>
                  )}
                  {currentCard === "counter" && showDescription && (
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
                          setShowDescription(false);
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

        {/* Scroll Down Button */}
        <div
          className={`hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-300 ${
            showScrollButton ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full animate-bounce backdrop-blur-sm bg-background/50 flex flex-col gap-1 h-auto py-2 px-4 w-auto"
            onClick={scrollToNextSection}
          >
            <p className="text-sm font-medium">Scroll Down</p>
            <ChevronDown className="h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Life Challenges Section */}
      <section className="py-24 mb-24">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Why is it so hard to stick to your habits?
              </h2>
              <p className="text-muted-foreground mt-2">
                Understanding the challenges of building a better life
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="font-semibold text-xl mb-4">
                    Lack of Direction
                  </h3>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      How to identify what truly matters?
                    </p>
                    <p className="text-muted-foreground">
                      Where to focus your energy?
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-4">⏰</div>
                  <h3 className="font-semibold text-xl mb-4">Inconsistency</h3>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      Watching productivity videos
                    </p>
                    <p className="text-muted-foreground">
                      Hard to stay focused on your goals
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-4">🌊</div>
                  <h3 className="font-semibold text-xl mb-4">Overwhelm</h3>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      Burnout from too many changes
                    </p>
                    <p className="text-muted-foreground">
                      Giving up on your goals
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats and Habit Tracking Section */}
      <section className="py-24 mb-24">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Track Your Life
              </h2>
              <p className="text-muted-foreground mt-2">
                Beautiful visualizations to keep you motivated
              </p>
            </div>

            {/* Yearly Heatmap */}
            <div className="grid grid-cols-1 gap-6">
              <BooleanHeatmap habit={booleanHabit} />
            </div>

            {/* Streak and Completion Rate Cards */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
              <CurrentStreakCard
                habit={booleanHabit}
                currentStreak={booleanHabit.currentStreak}
              />

              <LongestStreakCard
                habit={booleanHabit}
                longestStreak={booleanHabit.longestStreak}
              />

              <CompletionRateCard
                habit={booleanHabit}
                completionRate={booleanHabit.completionRate7Days || 100}
                title="Completion Rate"
                description="Last 7 days"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <CompletionRateCard
                habit={booleanHabit}
                completionRate={booleanHabit.completionRateMonth || 100}
                title="Monthly Rate"
                description="This month (completed days only)"
              />

              <CompletionRateCard
                habit={booleanHabit}
                completionRate={booleanHabit.completionRateYear || 100}
                title="Yearly Rate"
                description="This year (completed days only)"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Data Security Section */}
      <section className="py-24 mb-24 bg-gradient-to-r ">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="text-left space-y-5 flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-blue-800 dark:text-blue-300">
                Your Data is Safe with Us
              </h2>
              <p className="text-muted-foreground text-lg">
                All your habit data is securely stored in European data centers,
                complying with GDPR and the highest privacy standards.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-3 bg-white dark:bg-blue-950/40 p-3 rounded-lg shadow-sm">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">EU-based servers</span>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-blue-950/40 p-3 rounded-lg shadow-sm">
                  <CirclePlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">GDPR compliant</span>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-blue-950/40 p-3 rounded-lg shadow-sm">
                  <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">Secure storage</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 w-40 md:w-48">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg"
                alt="European Union Flag"
                className="w-full h-auto drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold tracking-tight">
              Start Building Better Habits Today
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users who have transformed their lives with
              small, consistent changes. Your journey to a better you starts
              with a single habit.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="text-lg px-8"
                onClick={() => navigate("/auth")}
              >
                Get Started for Free
              </Button>
            </div>
            <div className="pt-8 text-sm text-muted-foreground">
              No credit card required • 100% free forever
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
