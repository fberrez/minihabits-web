/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateHabitDto } from '../models/CreateHabitDto';
import type { Habit } from '../models/Habit';
import type { HabitStatsOutput } from '../models/HabitStatsOutput';
import type { HabitTypeOutput } from '../models/HabitTypeOutput';
import type { TrackHabitDto } from '../models/TrackHabitDto';
import type { UpdateHabitDto } from '../models/UpdateHabitDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HabitsService {
    /**
     * Get all habits for the current user
     * @returns Habit List of habits
     * @throws ApiError
     */
    public static habitsControllerGetHabits(): CancelablePromise<Array<Habit>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/habits',
        });
    }
    /**
     * Create a new habit
     * @returns Habit Habit created successfully
     * @throws ApiError
     */
    public static habitsControllerCreateHabit({
        requestBody,
    }: {
        requestBody: CreateHabitDto,
    }): CancelablePromise<Habit> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/habits',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get available habit types
     * @returns HabitTypeOutput List of habit types
     * @throws ApiError
     */
    public static habitsControllerGetHabitTypes(): CancelablePromise<Array<HabitTypeOutput>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/habits/types',
        });
    }
    /**
     * Get a habit by ID
     * @returns Habit Habit details
     * @throws ApiError
     */
    public static habitsControllerGetHabit({
        id,
    }: {
        /**
         * Habit ID
         */
        id: string,
    }): CancelablePromise<Habit> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/habits/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Delete a habit
     * @returns Habit Habit deleted successfully
     * @throws ApiError
     */
    public static habitsControllerDeleteHabit({
        id,
    }: {
        /**
         * Habit ID
         */
        id: string,
    }): CancelablePromise<Habit> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/habits/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update a habit
     * @returns Habit Habit updated successfully
     * @throws ApiError
     */
    public static habitsControllerUpdateHabit({
        id,
        requestBody,
    }: {
        /**
         * Habit ID
         */
        id: string,
        requestBody: UpdateHabitDto,
    }): CancelablePromise<Habit> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/habits/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get a habit by ID
     * @returns HabitStatsOutput Habit details
     * @throws ApiError
     */
    public static habitsControllerGetHabitStats({
        id,
    }: {
        /**
         * Habit ID
         */
        id: string,
    }): CancelablePromise<HabitStatsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/habits/{id}/stats',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Track a habit for a specific date
     * @returns Habit Habit tracked successfully
     * @throws ApiError
     */
    public static habitsControllerTrackHabit({
        id,
        requestBody,
    }: {
        /**
         * Habit ID
         */
        id: string,
        requestBody: TrackHabitDto,
    }): CancelablePromise<Habit> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/habits/{id}/track',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Untrack a habit for a specific date
     * @returns Habit Habit untracked successfully
     * @throws ApiError
     */
    public static habitsControllerUntrackHabit({
        id,
        requestBody,
    }: {
        /**
         * Habit ID
         */
        id: string,
        requestBody: TrackHabitDto,
    }): CancelablePromise<Habit> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/habits/{id}/track',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
