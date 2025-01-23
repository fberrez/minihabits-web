import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHabits } from '../contexts/HabitContext';
import { NewTask } from './NewTask';

export function EditTask() {
  const { habitId } = useParams();
  const { habits } = useHabits();
  const navigate = useNavigate();

  const habit = habits.find(h => h._id === habitId);

  useEffect(() => {
    if (!habit) {
      navigate('/');
    }
  }, [habit, navigate]);

  if (!habit) {
    return null;
  }

  return <NewTask initialData={habit} />;
} 