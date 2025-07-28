import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

// Tetris piece definitions
const PIECES = [
  [], // Empty
  [ // I piece
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  [ // O piece
    [2, 2],
    [2, 2]
  ],
  [ // T piece
    [0, 3, 0],
    [3, 3, 3],
    [0, 0, 0]
  ],
  [ // S piece
    [0, 4, 4],
    [4, 4, 0],
    [0, 0, 0]
  ],
  [ // Z piece
    [5, 5, 0],
    [0, 5, 5],
    [0, 0, 0]
  ],
  [ // J piece
    [6, 0, 0],
    [6, 6, 6],
    [0, 0, 0]
  ],
  [ // L piece
    [0, 0, 7],
    [7, 7, 7],
    [0, 0, 0]
  ]
];

interface GameState {
  board: number[][];
  currentPiece: {
    shape: number[][];
    position: { x: number; y: number };
    type: number;
  } | null;
  nextPiece: number[][];
  score: number;
  lines: number;
  level: number;
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
}

const createEmptyBoard = (): number[][] => {
  return Array(20).fill(null).map(() => Array(10).fill(0));
};

const getRandomPiece = () => {
  const type = Math.floor(Math.random() * 7) + 1;
  return { shape: PIECES[type], type };
};

export const useTetris = () => {
  const { toast } = useToast();
  const dropTimeRef = useRef<number>(1000);
  const lastDropTimeRef = useRef<number>(0);
  const gameLoopRef = useRef<number>();

  const [gameState, setGameState] = useState<GameState>(() => {
    const firstPiece = getRandomPiece();
    const nextPiece = getRandomPiece();
    
    return {
      board: createEmptyBoard(),
      currentPiece: {
        shape: firstPiece.shape,
        position: { x: 3, y: 0 },
        type: firstPiece.type
      },
      nextPiece: nextPiece.shape,
      score: 0,
      lines: 0,
      level: 1,
      isPlaying: false,
      isPaused: false,
      gameOver: false
    };
  });

  // Check collision
  const checkCollision = useCallback((board: number[][], piece: number[][], position: { x: number; y: number }) => {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x] !== 0) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          
          if (boardX < 0 || boardX >= 10 || boardY >= 20) {
            return true;
          }
          
          if (boardY >= 0 && board[boardY][boardX] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  // Rotate piece
  const rotatePiece = useCallback((piece: number[][]) => {
    const rotated = Array(piece[0].length).fill(null).map(() => Array(piece.length).fill(0));
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        rotated[x][piece.length - 1 - y] = piece[y][x];
      }
    }
    return rotated;
  }, []);

  // Clear lines
  const clearLines = useCallback((board: number[][]) => {
    const newBoard = [...board];
    let linesCleared = 0;
    
    for (let y = 19; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(10).fill(0));
        linesCleared++;
        y++; // Check this line again
      }
    }
    
    return { newBoard, linesCleared };
  }, []);

  // Calculate ghost piece position
  const getGhostPosition = useCallback((board: number[][], piece: number[][], position: { x: number; y: number }) => {
    let ghostY = position.y;
    while (!checkCollision(board, piece, { x: position.x, y: ghostY + 1 })) {
      ghostY++;
    }
    return { x: position.x, y: ghostY };
  }, [checkCollision]);

  // Place piece on board
  const placePiece = useCallback((board: number[][], piece: number[][], position: { x: number; y: number }, type: number) => {
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x] !== 0) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
            newBoard[boardY][boardX] = type;
          }
        }
      }
    }
    
    return newBoard;
  }, []);

  // Move piece
  const movePiece = useCallback((direction: 'left' | 'right' | 'down' | 'rotate' | 'hardDrop') => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver || !gameState.currentPiece) return;

    setGameState(prevState => {
      const { board, currentPiece } = prevState;
      if (!currentPiece) return prevState;

      let newPosition = { ...currentPiece.position };
      let newShape = currentPiece.shape;

      switch (direction) {
        case 'left':
          newPosition.x--;
          break;
        case 'right':
          newPosition.x++;
          break;
        case 'down':
          newPosition.y++;
          break;
        case 'rotate':
          newShape = rotatePiece(currentPiece.shape);
          break;
        case 'hardDrop':
          const ghostPos = getGhostPosition(board, currentPiece.shape, currentPiece.position);
          newPosition = ghostPos;
          break;
      }

      // Check if move is valid
      if (checkCollision(board, newShape, newPosition)) {
        if (direction === 'down' || direction === 'hardDrop') {
          // Place the piece
          const newBoard = placePiece(board, currentPiece.shape, currentPiece.position, currentPiece.type);
          const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
          
          // Check for game over
          if (currentPiece.position.y <= 0) {
            toast({
              title: "Game Over!",
              description: `Final Score: ${prevState.score.toLocaleString()}`,
            });
            return { ...prevState, gameOver: true, isPlaying: false };
          }

          // Calculate score
          const lineScore = [0, 100, 300, 500, 800][linesCleared] * prevState.level;
          const newScore = prevState.score + lineScore + (direction === 'hardDrop' ? 2 : 1);
          const newLines = prevState.lines + linesCleared;
          const newLevel = Math.floor(newLines / 10) + 1;

          // Generate next piece
          const nextPieceData = getRandomPiece();
          
          if (linesCleared > 0) {
            toast({
              title: `${linesCleared} Line${linesCleared > 1 ? 's' : ''} Cleared!`,
              description: `+${lineScore.toLocaleString()} points`,
            });
          }

          return {
            ...prevState,
            board: clearedBoard,
            currentPiece: {
              shape: prevState.nextPiece,
              position: { x: 3, y: 0 },
              type: prevState.nextPiece.flat().find(cell => cell !== 0) || 1
            },
            nextPiece: nextPieceData.shape,
            score: newScore,
            lines: newLines,
            level: newLevel
          };
        }
        return prevState; // Invalid move
      }

      return {
        ...prevState,
        currentPiece: {
          ...currentPiece,
          shape: newShape,
          position: newPosition
        }
      };
    });
  }, [gameState.isPlaying, gameState.isPaused, gameState.gameOver, checkCollision, rotatePiece, getGhostPosition, placePiece, clearLines, toast]);

  // Game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver) {
      return;
    }

    if (timestamp - lastDropTimeRef.current > dropTimeRef.current) {
      movePiece('down');
      lastDropTimeRef.current = timestamp;
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPlaying, gameState.isPaused, gameState.gameOver, movePiece]);

  // Start game loop
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameState.gameOver) {
      dropTimeRef.current = Math.max(50, 1000 - (gameState.level - 1) * 50);
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.gameOver, gameState.level, gameLoop]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          movePiece('left');
          break;
        case 'ArrowRight':
          event.preventDefault();
          movePiece('right');
          break;
        case 'ArrowDown':
          event.preventDefault();
          movePiece('down');
          break;
        case 'ArrowUp':
          event.preventDefault();
          movePiece('rotate');
          break;
        case ' ':
          event.preventDefault();
          movePiece('hardDrop');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPlaying, gameState.isPaused, gameState.gameOver, movePiece]);

  const startGame = useCallback(() => {
    const firstPiece = getRandomPiece();
    const nextPiece = getRandomPiece();
    
    setGameState({
      board: createEmptyBoard(),
      currentPiece: {
        shape: firstPiece.shape,
        position: { x: 3, y: 0 },
        type: firstPiece.type
      },
      nextPiece: nextPiece.shape,
      score: 0,
      lines: 0,
      level: 1,
      isPlaying: true,
      isPaused: false,
      gameOver: false
    });
    lastDropTimeRef.current = 0;
    toast({
      title: "Game Started!",
      description: "Good luck!",
    });
  }, [toast]);

  const togglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  // Get ghost piece position
  const ghostPiece = gameState.currentPiece 
    ? { position: getGhostPosition(gameState.board, gameState.currentPiece.shape, gameState.currentPiece.position) }
    : null;

  return {
    ...gameState,
    ghostPiece,
    startGame,
    togglePause,
    restartGame,
    movePiece
  };
};