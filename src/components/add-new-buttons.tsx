import { Card, CardContent } from "./ui/card";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <div
      className={`grid ${
        showBothButtons ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
      } gap-4 ${className}`}
    >
      <Card
        className="cursor-pointer transition-all hover:shadow-md border-dashed hover:translate-x-1 hover:-translate-y-1"
        onClick={() => handleClick("/new")}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Plus className="h-5 w-5" />
            <span className="text-lg">Add new habit</span>
          </div>
        </CardContent>
      </Card>

      {showBothButtons && (
        <Card
          className="cursor-pointer transition-all hover:shadow-md border-dashed hover:translate-x-1 hover:-translate-y-1"
          onClick={() => handleClick("/new-task")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Plus className="h-5 w-5" />
              <span className="text-lg">Add new task</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
