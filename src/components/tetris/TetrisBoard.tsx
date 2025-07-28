import { useEffect, useRef } from 'react';

interface TetrisBoardProps {
  board: number[][];
  currentPiece: {
    shape: number[][];
    position: { x: number; y: number };
    type: number;
  } | null;
  ghostPiece: {
    position: { x: number; y: number };
  } | null;
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

export const TetrisBoard = ({ board, currentPiece, ghostPiece }: TetrisBoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);

  // Create a visual board with current piece and ghost piece
  const createVisualBoard = () => {
    const visualBoard = board.map(row => [...row]);
    
    // Add ghost piece
    if (currentPiece && ghostPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const boardY = ghostPiece.position.y + y;
            const boardX = ghostPiece.position.x + x;
            if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
              if (visualBoard[boardY][boardX] === 0) {
                visualBoard[boardY][boardX] = -1; // Ghost piece marker
              }
            }
          }
        }
      }
    }
    
    // Add current piece
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const boardY = currentPiece.position.y + y;
            const boardX = currentPiece.position.x + x;
            if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
              visualBoard[boardY][boardX] = currentPiece.type;
            }
          }
        }
      }
    }
    
    return visualBoard;
  };

  const visualBoard = createVisualBoard();

  const getCellClass = (cellValue: number) => {
    if (cellValue === -1) {
      return 'bg-tetris-ghost opacity-30 border border-muted';
    }
    if (cellValue === 0) {
      return 'bg-secondary/20 border border-border/30';
    }
    return `${PIECE_COLORS[cellValue]} border border-foreground/20 shadow-sm`;
  };

  return (
    <div 
      ref={boardRef}
      className="grid grid-cols-10 gap-[1px] p-4 bg-card rounded-lg border-2 border-primary/30 shadow-2xl"
      style={{ 
        gridTemplateRows: 'repeat(20, 1fr)',
        aspectRatio: '10/20'
      }}
    >
      {visualBoard.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`aspect-square rounded-sm transition-all duration-150 ${getCellClass(cell)}`}
            style={{
              boxShadow: cell > 0 ? '0 0 8px rgba(168, 85, 247, 0.4)' : undefined
            }}
          />
        ))
      )}
    </div>
  );
};