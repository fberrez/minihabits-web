import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
  const { signOut } = useAuth();

  return (
    <Button
      size="icon"
      variant="destructive"
      onClick={signOut}
      title="Sign out"
    >
      <LogOut className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  );
}
