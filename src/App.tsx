import { useAuth } from "./contexts/AuthContext";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { HabitList } from "./pages/HabitList";
import { StatsPage } from "./pages/StatsPage";
import { NewHabit } from "./pages/NewHabit";
import { NewTask } from "./pages/NewTask";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import Account from "./pages/Account";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import { ArchivedTasks } from "./pages/ArchivedTasks";
import { EditTask } from "./pages/EditTask";
import { PricingPage } from "./pages/PricingPage";
import { SubscriptionSuccess } from "./pages/SubscriptionSuccess";

function App() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<HabitList />} />
        <Route path="/stats/:habitId" element={<StatsPage />} />
        <Route path="/new" element={<NewHabit />} />
        <Route path="/new-task" element={<NewTask />} />
        <Route path="/account" element={<Account />} />
        <Route path="/archived" element={<ArchivedTasks />} />
        <Route path="/edit-task/:habitId" element={<EditTask />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/subscription-success" element={<SubscriptionSuccess />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfUse />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
