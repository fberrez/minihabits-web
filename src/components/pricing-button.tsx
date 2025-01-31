import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { CreditCard } from "lucide-react";

export function PricingButton({ onSelect }: { onSelect: () => void }) {
  return (
    <Button variant="outline" asChild onClick={onSelect}>
      <Link to="/pricing" className="flex items-center">
        <CreditCard className="mr-2 h-4 w-4" />
        Pricing
      </Link>
    </Button>
  );
}
