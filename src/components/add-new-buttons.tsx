import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface AddNewButtonsProps {
  showBothButtons?: boolean;
  className?: string;
  redirectToAuth?: boolean;
}

export function AddNewButtons({
  showBothButtons = true,
  className = "",
  redirectToAuth = false,
}: AddNewButtonsProps) {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    navigate(redirectToAuth ? "/auth" : path);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button className="border-dashed" onClick={() => handleClick("/new")}>
        <Plus className="h-5 w-5 mr-2" />
        Add new habit
      </Button>

      {showBothButtons && (
        <Button
          className="border-dashed"
          onClick={() => handleClick("/new-task")}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add new task
        </Button>
      )}
    </div>
  );
}
