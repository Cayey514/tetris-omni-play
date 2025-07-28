import { useEffect, useState } from 'react';
import { TetrisBoard } from './TetrisBoard';
import { GameControls } from './GameControls';
import { GameStats } from './GameStats';
import { useTetris } from '@/hooks/useTetris';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Trophy } from 'lucide-react';

export const TetrisGame = () => {
  const [isMobile, setIsMobile] = useState(false);
  const {
    board,
    currentPiece,
    ghostPiece,
    nextPiece,
    score,
    lines,
    level,
    isPlaying,
    isPaused,
    gameOver,
    startGame,
    togglePause,
    restartGame,
    movePiece
  } = useTetris();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isPlaying && !gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4 bg-card/80 backdrop-blur-sm border-primary/30">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TETRIS
              </h1>
              <p className="text-muted-foreground">
                Classic block puzzle game
              </p>
            </div>
            
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">How to Play:</h3>
                <ul className="space-y-1 text-left">
                  <li>• Arrange falling blocks to form complete lines</li>
                  <li>• Complete lines disappear and give you points</li>
                  <li>• Game ends when blocks reach the top</li>
                </ul>
              </div>
              
              {!isMobile && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Controls:</h3>
                  <ul className="space-y-1 text-left">
                    <li>• Arrow keys to move and rotate</li>
                    <li>• Space bar for hard drop</li>
                  </ul>
                </div>
              )}
            </div>

            <Button 
              onClick={startGame}
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4 bg-card/80 backdrop-blur-sm border-destructive/30">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <Trophy className="w-16 h-16 mx-auto text-accent" />
              <h2 className="text-3xl font-bold text-foreground">Game Over</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{score.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-accent">{lines}</div>
                  <div className="text-sm text-muted-foreground">Lines</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">{level}</div>
                <div className="text-sm text-muted-foreground">Level Reached</div>
              </div>
            </div>

            <Button 
              onClick={restartGame}
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Play className="w-5 h-5 mr-2" />
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-sm mx-auto space-y-4">
          {/* Header with stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-card/50 rounded-lg p-2 border border-primary/30">
              <div className="text-lg font-bold text-primary">{score.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
            <div className="bg-card/50 rounded-lg p-2 border border-accent/30">
              <div className="text-lg font-bold text-accent">{lines}</div>
              <div className="text-xs text-muted-foreground">Lines</div>
            </div>
            <div className="bg-card/50 rounded-lg p-2 border border-border">
              <div className="text-lg font-bold text-foreground">{level}</div>
              <div className="text-xs text-muted-foreground">Level</div>
            </div>
          </div>

          {/* Game board */}
          <div className="aspect-[10/20] max-w-full">
            <TetrisBoard 
              board={board} 
              currentPiece={currentPiece} 
              ghostPiece={ghostPiece} 
            />
          </div>

          {/* Controls */}
          <GameControls
            isPlaying={isPlaying}
            isPaused={isPaused}
            onTogglePause={togglePause}
            onRestart={restartGame}
            onMove={movePiece}
            isMobile={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            TETRIS
          </h1>
          {isPaused && (
            <div className="text-xl font-semibold text-accent animate-pulse">
              PAUSED
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stats - Left side */}
          <div className="lg:order-1">
            <GameStats 
              score={score} 
              lines={lines} 
              level={level} 
              nextPiece={nextPiece} 
            />
          </div>

          {/* Game board - Center */}
          <div className="lg:col-span-2 lg:order-2 flex justify-center">
            <div className="w-full max-w-md">
              <TetrisBoard 
                board={board} 
                currentPiece={currentPiece} 
                ghostPiece={ghostPiece} 
              />
            </div>
          </div>

          {/* Controls - Right side */}
          <div className="lg:order-3">
            <GameControls
              isPlaying={isPlaying}
              isPaused={isPaused}
              onTogglePause={togglePause}
              onRestart={restartGame}
              onMove={movePiece}
              isMobile={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};