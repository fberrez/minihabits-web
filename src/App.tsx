import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Button } from './components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { useToast } from './hooks/use-toast';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { HabitList } from './pages/HabitList';
import { StatsPage } from './pages/StatsPage';
import { NewHabit } from './pages/NewHabit';
import FlickeringGrid from './components/ui/flickering-grid';
import { useTheme } from './components/theme-provider';

function App() {
  const { isAuthenticated, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        // @ts-expect-error plausible is added by the script tag
        window.plausible('signup');
      } else {
        await signIn(email, password);
        // @ts-expect-error plausible is added by the script tag
        window.plausible('signin');
      }

      toast({
        title: isSignUp ? 'Account created' : 'Welcome back',
        description: isSignUp
          ? 'You have been successfully signed up and logged in.'
          : 'You have been successfully logged in.',
      });
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: 'Authentication failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<HabitList />} />
        <Route path="/stats/:habitId" element={<StatsPage />} />
        <Route path="/new" element={<NewHabit />} />
      </Routes>
    );
  }

  if (!showAuth) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden">
        <FlickeringGrid
          className="absolute z-0 inset-0 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
          squareSize={3}
          gridGap={6}
          color={theme === 'dark' ? '#ffffff' : '#000000'}
          maxOpacity={0.2}
          flickerChance={0.1}
          height={1600}
          width={1600}
        />
        <div className="z-10 flex flex-col items-center">
          <h1 className="text-6xl font-bold mb-4 text-center tracking-tighter">
            minihabits.
          </h1>
          <p className="text-lg text-center text-gray-600 mb-8 max-w-md">
            Track your habits and build lasting habits
          </p>
          <Button
            size="lg"
            onClick={() => setShowAuth(true)}
            className="relative z-10"
          >
            Get Started
          </Button>
          <p className="text-sm text-gray-600 mt-4">
            Free to use. No credit card required
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4">
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <CardTitle>
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Enter your email below to create your account'
              : 'Enter your email below to sign in to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete={isSignUp ? 'new-email' : 'email'}
                placeholder="m@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : isSignUp ? (
                'Sign Up'
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          <Button
            variant="secondary"
            className="w-full mt-4"
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={isLoading}
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
