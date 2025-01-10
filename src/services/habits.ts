interface Habit {
  _id: string;
  name: string;
  createdAt: Date;
  userId: string;
  completedDates: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
}

interface Stats {
  totalHabits: number;
  completedToday: number;
  averageCompletion: number;
  longestStreak: number;
}

export class HabitService {
  private static BASE_URL = import.meta.env.VITE_API_BASE_URL;

  private static getHeaders(accessToken: string): HeadersInit {
    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  static async createHabit(accessToken: string, name: string): Promise<Habit> {
    const response = await fetch(`${this.BASE_URL}/habits`, {
      method: 'POST',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Failed to create habit');
    }

    return response.json();
  }

  static async updateHabit(accessToken: string, name: string): Promise<Habit> {
    const response = await fetch(`${this.BASE_URL}/habits`, {
      method: 'PUT',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Failed to update habit');
    }

    return response.json();
  }

  static async deleteHabit(accessToken: string, name: string): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/habits/${name}`, {
      method: 'DELETE',
      headers: this.getHeaders(accessToken),
    });

    if (!response.ok) {
      throw new Error('Failed to delete habit');
    }
  }

  static async getHabits(accessToken: string): Promise<Habit[]> {
    const response = await fetch(`${this.BASE_URL}/habits`, {
      method: 'GET',
      headers: this.getHeaders(accessToken),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch habits');
    }

    return response.json();
  }

  static async trackHabit(accessToken: string, habitId: string, date: string): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/habits/${habitId}/track`, {
      method: 'POST',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({ date }),
    });

    if (!response.ok) {
      throw new Error('Failed to track habit');
    }
  }

  static async untrackHabit(accessToken: string, habitId: string, date: string): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/habits/${habitId}/track`, {
      method: 'DELETE',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({ date }),
    });

    if (!response.ok) {
      throw new Error('Failed to untrack habit');
    }
  }

  static async getHabitStreak(accessToken: string, habitId: string): Promise<number> {
    const response = await fetch(`${this.BASE_URL}/habits/${habitId}/streak`, {
      method: 'GET',
      headers: this.getHeaders(accessToken),
    });

    if (!response.ok) {
      throw new Error('Failed to get habit streak');
    }

    return response.json();
  }

  static async getStats(accessToken: string): Promise<Stats> {
    const response = await fetch(`${this.BASE_URL}/habits/stats`, {
      method: 'GET',
      headers: this.getHeaders(accessToken),
    });

    if (!response.ok) {
      throw new Error('Failed to get stats');
    }

    return response.json();
  }
} 