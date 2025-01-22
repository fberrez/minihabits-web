import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Archive } from 'lucide-react';

export function ArchivedTasksButton({ onSelect }: { onSelect: () => void }) {
  return (
    <Button variant="outline" asChild onClick={onSelect}>
      <Link to="/archived" className="flex items-center">
        <Archive className="mr-2 h-4 w-4" />
        View archived tasks
      </Link>
    </Button>
  );
} 