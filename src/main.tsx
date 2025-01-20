import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/theme-provider.tsx';
import { HabitProvider } from './contexts/HabitContext';
import { Toaster } from './components/ui/toaster.tsx';
import { TopBar } from './components/top-bar.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <HabitProvider>
            <Toaster />
            <TopBar />
            <main className="pt-14">
              <App />
            </main>
          </HabitProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
