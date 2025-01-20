import { Loader2 } from 'lucide-react';
import AnimatedGradientText from './ui/animated-gradient-text';
import { cn } from '@/lib/utils';
import { StatsService } from '@/services/stats';
import { useEffect, useState } from 'react';
import { type HomeStats } from '@/types/homestats';

export function HomeStats() {
  const [homeStats, setHomeStats] = useState<HomeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeStats = async () => {
      try {
        const response = await StatsService.getHomeStats();
        setHomeStats(response);
        setIsLoading(false);
      } catch (error) {
        setError('Error fetching home stats');
        setIsLoading(false);
      }
    };
    fetchHomeStats();
  }, []);

  return !error ? (
    <div className="z-10 p-6 flex items-center justify-center">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : (
        <AnimatedGradientText>
          🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{' '}
          <span
            className={cn(
              `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
            )}
          >
            {homeStats?.totalCompleted} habits completed today
          </span>
        </AnimatedGradientText>
      )}
    </div>
  ) : (
    <></>
  );
}
