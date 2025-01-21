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
import { Footer } from './components/footer.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <HabitProvider>
            <Toaster />
            <TopBar />
            <main className="pt-14 min-h-[calc(100vh-3.5rem)]">
              <App />
            </main>
            <Footer />
          </HabitProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
