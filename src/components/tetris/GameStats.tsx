import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GameStatsProps {
  score: number;
  lines: number;
  level: number;
  nextPiece: number[][] | null;
}

const PIECE_COLORS = [
  '', // Empty
  'bg-tetris-i', // I piece - Cyan
  'bg-tetris-o', // O piece - Yellow
  'bg-tetris-t', // T piece - Purple
  'bg-tetris-s', // S piece - Green
  'bg-tetris-z', // Z piece - Red
  'bg-tetris-j', // J piece - Blue
  'bg-tetris-l', // L piece - Orange
];

export const GameStats = ({ score, lines, level, nextPiece }: GameStatsProps) => {
  const formatScore = (score: number) => {
    return score.toLocaleString();
  };

  const renderNextPiece = () => {
    if (!nextPiece) return null;
    
    // Find the piece type (assuming it's stored in the shape)
    let pieceType = 0;
    for (let y = 0; y < nextPiece.length; y++) {
      for (let x = 0; x < nextPiece[y].length; x++) {
        if (nextPiece[y][x] !== 0) {
          pieceType = nextPiece[y][x];
          break;
        }
      }
      if (pieceType !== 0) break;
    }

    return (
      <div className="grid gap-[1px] justify-center" style={{
        gridTemplateColumns: `repeat(${nextPiece[0]?.length || 4}, 1fr)`,
        gridTemplateRows: `repeat(${nextPiece.length}, 1fr)`
      }}>
        {nextPiece.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`w-4 h-4 rounded-sm border ${
                cell === 0 
                  ? 'bg-transparent border-transparent' 
                  : `${PIECE_COLORS[pieceType]} border-foreground/20`
              }`}
              style={{
                boxShadow: cell !== 0 ? '0 0 4px rgba(168, 85, 247, 0.3)' : undefined
              }}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 border-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-primary">Score</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-foreground">{formatScore(score)}</div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-accent/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-accent">Lines</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xl font-bold text-foreground">{lines}</div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Level</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xl font-bold text-foreground">{level}</div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Next</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex justify-center">
          <div className="w-16 h-16 flex items-center justify-center">
            {renderNextPiece()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};