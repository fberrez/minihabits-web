import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
  const { signOut } = useAuth();

  return (
    <Button variant="outline" onClick={signOut} title="Sign out">
      <LogOut className="mr-2 h-4 w-4" /> Sign out
    </Button>
  );
}
