import { Habit, GlobalStats, HabitColor, HabitType } from '../types/habit';

export class HabitService {
  private static BASE_URL = import.meta.env.VITE_API_BASE_URL;

  private static getHeaders(accessToken: string): HeadersInit {
    return {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  static async createHabit(
    accessToken: string,
    name: string,
    color?: HabitColor,
    type: HabitType = HabitType.BOOLEAN,
    targetCounter?: number,
  ): Promise<Habit> {
    const response = await fetch(`${this.BASE_URL}/habits`, {
      method: 'POST',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({ name, color, type, targetCounter }),
    });

    if (!response.ok) {
      throw new Error('Failed to create habit');
    }

    return response.json();
  }

  static async updateHabit(
    accessToken: string,
    habitId: string,
    data: { name?: string; color?: HabitColor },
  ): Promise<Habit> {
    const response = await fetch(`${this.BASE_URL}/habits/${habitId}`, {
      method: 'PUT',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify(data),
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

  static async trackHabit(
    accessToken: string,
    habitId: string,
    date: string,
  ): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/habits/${habitId}/track`, {
      method: 'POST',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({ date }),
    });

    if (!response.ok) {
      throw new Error('Failed to track habit');
    }
  }

  static async untrackHabit(
    accessToken: string,
    habitId: string,
    date: string,
  ): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/habits/${habitId}/track`, {
      method: 'DELETE',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({ date }),
    });

    if (!response.ok) {
      throw new Error('Failed to untrack habit');
    }
  }

  static async getHabitStreak(
    accessToken: string,
    habitId: string,
  ): Promise<number> {
    const response = await fetch(`${this.BASE_URL}/habits/${habitId}/streak`, {
      method: 'GET',
      headers: this.getHeaders(accessToken),
    });

    if (!response.ok) {
      throw new Error('Failed to get habit streak');
    }

    return response.json();
  }

  static async getStats(accessToken: string): Promise<GlobalStats> {
    const response = await fetch(`${this.BASE_URL}/habits/stats`, {
      method: 'GET',
      headers: this.getHeaders(accessToken),
    });

    if (!response.ok) {
      throw new Error('Failed to get stats');
    }

    return response.json();
  }

  static async getHabitTypes(accessToken: string): Promise<HabitType[]> {
    const response = await fetch(`${this.BASE_URL}/habits/types`, {
      method: 'GET',
      headers: this.getHeaders(accessToken),
    });

    if (!response.ok) {
      throw new Error('Failed to get habit types');
    }

    return response.json();
  }
}
