import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Gem } from "lucide-react";

export function PointsBalance({ points }: { points: number }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center bg-primary/10 px-3 py-1 rounded-full text-sm font-medium">
            <Gem className="h-4 w-4 text-primary mr-2" />
            <span className="text-primary">{points}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your ad creation balance. Each ad costs points.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
