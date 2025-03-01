import { useState } from "react";
import { useHabits } from "../api/hooks/useHabits";
import { Habit } from "../api/generated";

export function HabitListExample() {
  const {
    habits,
    isLoading,
    error,
    createHabit,
    deleteHabit,
    trackHabit,
    untrackHabit,
    isCreating,
    isDeleting,
    isTracking,
    isUntracking,
  } = useHabits();

  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitColor, setNewHabitColor] = useState<string>("#64b5f6"); // Blue
  const [newHabitType, setNewHabitType] = useState<string>("boolean");

  const handleCreateHabit = () => {
    if (newHabitName.trim()) {
      createHabit(newHabitName.trim(), newHabitColor, newHabitType);
      setNewHabitName("");
    }
  };

  const handleTrackHabit = (habitId: string) => {
    const today = new Date().toISOString().split("T")[0];
    trackHabit(habitId, today);
  };

  const handleUntrackHabit = (habitId: string) => {
    const today = new Date().toISOString().split("T")[0];
    untrackHabit(habitId, today);
  };

  if (isLoading) {
    return <div>Loading habits...</div>;
  }

  if (error) {
    return <div>Error loading habits: {error.toString()}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Habits</h2>

      <div className="mb-4 flex flex-col space-y-2">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="New habit name"
          className="border p-2 rounded"
        />

        <select
          value={newHabitColor}
          onChange={(e) => setNewHabitColor(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="#e57373">Red</option>
          <option value="#64b5f6">Blue</option>
          <option value="#81c784">Green</option>
          <option value="#ffd54f">Yellow</option>
          <option value="#ba68c8">Purple</option>
          <option value="#ffb74d">Orange</option>
          <option value="#f06292">Pink</option>
          <option value="#4db6ac">Teal</option>
        </select>

        <select
          value={newHabitType}
          onChange={(e) => setNewHabitType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="boolean">Boolean</option>
          <option value="counter">Counter</option>
          <option value="negative_boolean">Negative Boolean</option>
          <option value="negative_counter">Negative Counter</option>
        </select>

        <button
          onClick={handleCreateHabit}
          disabled={isCreating || !newHabitName.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          {isCreating ? "Creating..." : "Add Habit"}
        </button>
      </div>

      <ul className="space-y-2">
        {habits.map((habit: Habit) => (
          <li
            key={habit._id}
            className="border p-3 rounded flex justify-between items-center"
            style={{ borderLeftColor: habit.color, borderLeftWidth: "4px" }}
          >
            <div>
              <span className="font-medium">{habit.name}</span>
              <div className="text-sm text-gray-500">
                Type: {habit.type} | Streak: {habit.currentStreak} | Completed
                Dates: {Object.keys(habit.completedDates || {}).length}
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleTrackHabit(habit._id)}
                disabled={isTracking}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                Complete
              </button>
              <button
                onClick={() => handleUntrackHabit(habit._id)}
                disabled={isUntracking}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
              >
                Undo
              </button>
              <button
                onClick={() => deleteHabit(habit._id)}
                disabled={isDeleting}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {habits.length === 0 && (
          <li className="text-gray-500 text-center py-4">
            No habits yet. Create one above!
          </li>
        )}
      </ul>
    </div>
  );
}
