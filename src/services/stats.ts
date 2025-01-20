import { HomeStats } from '@/types/homestats';

export class StatsService {
  private static BASE_URL = import.meta.env.VITE_API_BASE_URL;

  static async getHomeStats(): Promise<HomeStats> {
    const response = await fetch(`${this.BASE_URL}/stats/home`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to get home stats');
    }

    return response.json();
  }
}
