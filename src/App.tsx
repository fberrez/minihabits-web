import { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import { Button } from "./components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import './App.css'

function App() {
  const { isAuthenticated, signIn, signUp, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isSignUp) {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
      setEmail('')
      setPassword('')
    } catch (error) {
      console.error('Authentication error:', error)
    }
  }

  if (isAuthenticated) {
    return (
      <Card className="w-[400px] mx-auto mt-8">
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
          <CardDescription>You are now authenticated.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={signOut} variant="destructive">Sign Out</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-[400px] mx-auto mt-8">
      <CardHeader>
        <CardTitle>{isSignUp ? 'Create an account' : 'Welcome back'}</CardTitle>
        <CardDescription>
          {isSignUp 
            ? 'Enter your email below to create your account' 
            : 'Enter your email below to sign in to your account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>
        <Button
          variant="link"
          className="w-full mt-4"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Button>
      </CardContent>
    </Card>
  )
}

export default App
