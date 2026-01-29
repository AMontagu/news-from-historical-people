import { Button } from "@/components/ui/button";
import { type HistoricalFigure } from "@/data/figures";
import { cn } from "@/lib/utils";

interface CharacterSwitcherProps {
  figures: HistoricalFigure[];
  currentFigure: HistoricalFigure | null;
  onSwitch: (figure: HistoricalFigure) => void;
  disabled?: boolean;
  label: string;
}

export function CharacterSwitcher({
  figures,
  currentFigure,
  onSwitch,
  disabled = false,
  label,
}: CharacterSwitcherProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground text-center">
        {label}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {figures.map((figure) => (
          <Button
            key={figure.id}
            variant={currentFigure?.id === figure.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSwitch(figure)}
            disabled={disabled || currentFigure?.id === figure.id}
            className={cn(
              "gap-1.5 transition-all",
              currentFigure?.id === figure.id && "ring-2 ring-primary ring-offset-2"
            )}
          >
            <span className="text-lg">{figure.avatar}</span>
            <span className="hidden sm:inline">{figure.name.split(" ")[0]}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
