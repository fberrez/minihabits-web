import { Mail } from 'lucide-react';
import { Button } from './ui/button';

export function FeedbackButton() {
  const handleClick = () => {
    window.location.href =
      'mailto:contact@fberrez.co?subject=MiniHabits%20Feedback';
  };

  return (
    <Button onClick={handleClick} title="Send feedback">
      <Mail className="h-[1.2rem] w-[1.2rem]" /> Give me feedback!
    </Button>
  );
}
