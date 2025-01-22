import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useHabits } from '@/contexts/HabitContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from './ui/card';
import NumberTicker from './ui/number-ticker';
import { ModeToggle } from './mode-toggle';
import { FeedbackButton } from './feedback-button';
import { useState } from 'react';
import { SignOutButton } from './sign-out-button';
import { AccountSettingsButton } from './account-settings-button';
import { Link } from 'react-router-dom';
import { ArchivedTasksButton } from './archived-tasks-button';

export function TopBar() {
  const { isAuthenticated } = useAuth();
  const { stats } = useHabits();
  const [open, setOpen] = useState(false);

  const menuItems = (
    <div className="flex flex-col gap-4 mt-4">
      <Card className="flex flex-col items-center justify-center">
        <CardHeader>
          <CardTitle className="text-center">Today's Progress</CardTitle>
          <CardDescription className="text-center">
            {isAuthenticated
              ? 'Habits completed today'
              : 'Track your daily habits'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {isAuthenticated ? (
            <>
              <div className="text-4xl font-bold">
                {stats?.habitsCompletedToday === 0 ? (
                  <p>0</p>
                ) : (
                  <NumberTicker value={stats?.habitsCompletedToday || 0} />
                )}
              </div>
              <p className="text-muted-foreground mt-2">habits</p>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              Sign in to start tracking your habits
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex flex-col gap-2">
        {isAuthenticated && (
          <>
            <AccountSettingsButton onSelect={() => setOpen(false)} />
            <ArchivedTasksButton onSelect={() => setOpen(false)} />
          </>
        )}
        <ModeToggle />
        {isAuthenticated && <FeedbackButton />}
        {isAuthenticated && <SignOutButton onSelect={() => setOpen(false)} />}
      </div>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between h-14 px-4 max-w-5xl mx-auto">
        <h1 className="text-xl font-bold">
          <Link to="/">minihabits.</Link>
        </h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            {menuItems}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
