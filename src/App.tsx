import { useAuth } from './contexts/AuthContext';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HabitList } from './pages/HabitList';
import { StatsPage } from './pages/StatsPage';
import { NewHabit } from './pages/NewHabit';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import Account from './pages/Account';
import ResetPassword from './pages/ResetPassword';

function App() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<HabitList />} />
        <Route path="/stats/:habitId" element={<StatsPage />} />
        <Route path="/new" element={<NewHabit />} />
        <Route path="/account" element={<Account />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
