import { Button } from '@/components/ui/button';
import FlickeringGrid from '@/components/ui/flickering-grid';
import { HomeStats } from '@/components/home-stats';
import { useTheme } from '@/components/theme-provider';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center px-4 overflow-hidden">
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
        <HomeStats />
        <h1 className="text-6xl font-bold mb-4 text-center tracking-tighter">
          minihabits.
        </h1>
        <p className="text-lg text-center text-gray-600 mb-8 max-w-md">
          Track your habits and build lasting habits
        </p>
        <Button
          size="lg"
          onClick={() => navigate('/auth')}
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
