import { Button } from '@/components/ui/button';
import { Pause, Play, RotateCw, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface GameControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
  onRestart: () => void;
  onMove: (direction: 'left' | 'right' | 'down' | 'rotate') => void;
  isMobile: boolean;
}

export const GameControls = ({ 
  isPlaying, 
  isPaused, 
  onTogglePause, 
  onRestart, 
  onMove,
  isMobile 
}: GameControlsProps) => {
  if (!isMobile) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button
            onClick={onTogglePause}
            variant="outline"
            size="sm"
            className="flex-1 bg-primary/10 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button
            onClick={onRestart}
            variant="outline"
            size="sm"
            className="bg-accent/10 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            Restart
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="font-semibold text-foreground mb-2">Controls:</div>
          <div>← → Arrow Keys: Move</div>
          <div>↓ Arrow Key: Soft Drop</div>
          <div>↑ Arrow Key: Rotate</div>
          <div>Space: Hard Drop</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 mb-4">
        <Button
          onClick={onTogglePause}
          variant="outline"
          size="sm"
          className="flex-1 bg-primary/10 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          {isPaused ? <Play className="w-4 h-4 mr-1" /> : <Pause className="w-4 h-4 mr-1" />}
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
        <Button
          onClick={onRestart}
          variant="outline"
          size="sm"
          className="bg-accent/10 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        >
          Restart
        </Button>
      </div>

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
        <div></div>
        <Button
          onTouchStart={() => onMove('rotate')}
          variant="outline"
          size="lg"
          className="aspect-square bg-primary/10 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <RotateCw className="w-6 h-6" />
        </Button>
        <div></div>
        
        <Button
          onTouchStart={() => onMove('left')}
          variant="outline"
          size="lg"
          className="aspect-square bg-secondary border-border hover:bg-secondary/80"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        
        <Button
          onTouchStart={() => onMove('down')}
          variant="outline"
          size="lg"
          className="aspect-square bg-secondary border-border hover:bg-secondary/80"
        >
          <ChevronDown className="w-6 h-6" />
        </Button>
        
        <Button
          onTouchStart={() => onMove('right')}
          variant="outline"
          size="lg"
          className="aspect-square bg-secondary border-border hover:bg-secondary/80"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};