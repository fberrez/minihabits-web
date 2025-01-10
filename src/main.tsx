import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './components/theme-provider.tsx'
import { ModeToggle } from './components/mode-toggle.tsx'
import { SignOutButton } from './components/sign-out-button.tsx'
import { HabitProvider } from './contexts/HabitContext'
import { Toaster } from "./components/ui/toaster.tsx"

function Controls() {
  const { isAuthenticated } = useAuth()
  
  return (
    <>
      <Toaster />
      <div className="mode-toggle-container flex gap-2">
        {isAuthenticated && <SignOutButton />}
        <ModeToggle />
      </div>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Controls />
          <HabitProvider>
            <App />
          </HabitProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
    <script defer data-domain="minihabits-web-production.up.railway.app" src="https://plausible.io/js/script.js"></script>
  </StrictMode>,
)
