import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './components/theme-provider.tsx'
import { ModeToggle } from './components/mode-toggle.tsx'
import { HabitProvider } from './contexts/HabitContext'
import { Toaster } from "./components/ui/toaster.tsx"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <div className="mode-toggle-container">
        <ModeToggle />
      </div>
      <BrowserRouter>
        <AuthProvider>
          <HabitProvider>
            <App />
            <Toaster />
          </HabitProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
