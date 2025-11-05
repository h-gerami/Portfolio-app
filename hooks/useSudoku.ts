import { useState, useEffect, useCallback } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert";

export type MoveHistory = {
  row: number;
  col: number;
  previousValue: number;
  previousNotes: number[];
};

export type CellPosition = { row: number; col: number } | null;

const GRID_SIZE = 9; // Standard 9x9 Sudoku
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // 1-9 for standard Sudoku

// Difficulty presets: number of clues (pre-filled cells) for 9x9 grid
const DIFFICULTY_CLUES: Record<Difficulty, number> = {
  easy: 76,      // ~94% filled (super easy - only 5 numbers to fill)
  medium: 36,    // ~44% filled (standard medium)
  hard: 27,      // ~33% filled (standard hard)
  expert: 18,    // ~22% filled (standard expert)
};

// Generate a valid Sudoku solution
function generateSudokuSolution(): number[][] {
  const grid: number[][] = Array.from({ length: GRID_SIZE }, () => 
    Array(GRID_SIZE).fill(0)
  );

  function isValid(row: number, col: number, num: number): boolean {
    // Check row
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[row][c] === num) return false;
    }

    // Check column
    for (let r = 0; r < GRID_SIZE; r++) {
      if (grid[r][col] === num) return false;
    }

    // Check 3x3 box (standard Sudoku)
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (grid[r][c] === num) return false;
      }
    }

    return true;
  }

  function solve(row = 0, col = 0): boolean {
    if (row === GRID_SIZE) return true;
    if (col === GRID_SIZE) return solve(row + 1, 0);
    if (grid[row][col] !== 0) return solve(row, col + 1);

    const nums = [...NUMBERS].sort(() => Math.random() - 0.5);
    for (const num of nums) {
      if (isValid(row, col, num)) {
        grid[row][col] = num;
        if (solve(row, col + 1)) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  }

  solve();
  return grid;
}

// Remove numbers based on difficulty - ensure proper randomization
function removeNumbers(grid: number[][], difficulty: Difficulty): { grid: number[][]; readOnly: boolean[][] } {
  const clues = DIFFICULTY_CLUES[difficulty];
  const totalCells = GRID_SIZE * GRID_SIZE;
  const cellsToRemove = totalCells - clues;

  const result = grid.map(row => [...row]);
  const readOnly = grid.map(row => row.map(() => false));

  // Create list of all positions with proper shuffle
  const positions: { row: number; col: number }[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      positions.push({ row: r, col: c });
    }
  }

  // Proper Fisher-Yates shuffle for better randomness
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // Remove cells based on difficulty
  for (let i = 0; i < cellsToRemove && i < positions.length; i++) {
    const { row, col } = positions[i];
    result[row][col] = 0;
  }

  // Mark remaining cells as read-only (these are the clues)
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (result[r][c] !== 0) {
        readOnly[r][c] = true;
      }
    }
  }

  return { grid: result, readOnly };
}

export function useSudoku() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [sudoku, setSudoku] = useState<number[][]>(
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0))
  );
  const [readOnly, setReadOnly] = useState<boolean[][]>(
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false))
  );
  const [notes, setNotes] = useState<number[][][]>(
    Array.from({ length: GRID_SIZE }, () => 
      Array.from({ length: GRID_SIZE }, () => [])
    )
  );
  const [selectedCell, setSelectedCell] = useState<CellPosition>(null);
  const [history, setHistory] = useState<MoveHistory[]>([]);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [solution, setSolution] = useState<number[][]>([]);

  const generateNewPuzzle = useCallback((newDifficulty: Difficulty) => {
    // Generate puzzle synchronously to avoid delay
    const generatedSolution = generateSudokuSolution();
    const { grid, readOnly: readonly } = removeNumbers(generatedSolution, newDifficulty);
    setSudoku(grid);
    setReadOnly(readonly);
    setSolution(generatedSolution); // Store the solution for win checking
    setNotes(Array.from({ length: GRID_SIZE }, () => 
      Array.from({ length: GRID_SIZE }, () => [])
    ));
    setSelectedCell(null);
    setHistory([]);
    setDifficulty(newDifficulty);
    setIsPencilMode(false);
    setShowWinModal(false);
  }, []);

  const resetCurrentGame = useCallback(() => {
    // Reset to initial puzzle state (keep clues, clear user entries and notes)
    setSudoku((prev) => {
      const reset = prev.map((row, r) => 
        row.map((cell, c) => (readOnly[r][c] ? cell : 0))
      );
      return reset;
    });
    setNotes(Array.from({ length: GRID_SIZE }, () => 
      Array.from({ length: GRID_SIZE }, () => [])
    ));
    setSelectedCell(null);
    setHistory([]);
  }, [readOnly]);

  const undoLastMove = useCallback(() => {
    if (history.length === 0) return;

    const lastMove = history[history.length - 1];
    setSudoku((prev) => {
      const copy = prev.map((r) => [...r]);
      copy[lastMove.row][lastMove.col] = lastMove.previousValue;
      return copy;
    });
    setNotes((prev) => {
      const copy = prev.map((row) => row.map((notes) => [...notes]));
      copy[lastMove.row][lastMove.col] = lastMove.previousNotes;
      return copy;
    });
    setHistory((prev) => prev.slice(0, -1));
  }, [history]);

  const handleNumberInput = useCallback((num: number) => {
    if (!selectedCell || readOnly[selectedCell.row][selectedCell.col]) return;

    const { row, col } = selectedCell;
    const previousValue = sudoku[row][col];
    const previousNotes = [...notes[row][col]];

    // Save to history
    setHistory((prev) => [...prev, { row, col, previousValue, previousNotes }]);

    if (isPencilMode) {
      // Toggle pencil mark
      setNotes((prev) => {
        const copy = prev.map((r) => r.map((cellNotes) => [...cellNotes]));
        const cellNotes = copy[row][col];
        const index = cellNotes.indexOf(num);
        
        if (index >= 0) {
          // Remove if exists
          cellNotes.splice(index, 1);
        } else {
          // Add if not exists (max 6 notes)
          if (cellNotes.length < 6) {
            cellNotes.push(num);
            cellNotes.sort((a, b) => a - b);
          }
        }
        return copy;
      });
    } else {
      // Regular number input
      setSudoku((prev) => {
        const copy = prev.map((r) => [...r]);
        // If same number, clear it; otherwise set it
        copy[row][col] = copy[row][col] === num ? 0 : num;
        return copy;
      });
      // Clear notes when entering a number
      setNotes((prev) => {
        const copy = prev.map((r) => r.map((cellNotes) => [...cellNotes]));
        copy[row][col] = [];
        return copy;
      });
    }
  }, [selectedCell, readOnly, sudoku, notes, isPencilMode]);

  const handleClear = useCallback(() => {
    if (!selectedCell || readOnly[selectedCell.row][selectedCell.col]) return;

    const { row, col } = selectedCell;
    const previousValue = sudoku[row][col];
    const previousNotes = [...notes[row][col]];

    // Save to history
    setHistory((prev) => [...prev, { row, col, previousValue, previousNotes }]);

    setSudoku((prev) => {
      const copy = prev.map((r) => [...r]);
      copy[row][col] = 0;
      return copy;
    });
    setNotes((prev) => {
      const copy = prev.map((r) => r.map((cellNotes) => [...cellNotes]));
      copy[row][col] = [];
      return copy;
    });
  }, [selectedCell, readOnly, sudoku, notes]);

  // Check for win condition
  const checkWin = useCallback(() => {
    // Check if all cells are filled
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (sudoku[r][c] === 0) {
          return false;
        }
      }
    }

    // Check if the solution matches the stored solution
    if (solution.length === 0) return false;

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (sudoku[r][c] !== solution[r][c]) {
          return false;
        }
      }
    }

    return true;
  }, [sudoku, solution]);

  // Check for win after each move
  useEffect(() => {
    if (checkWin() && !showWinModal) {
      setShowWinModal(true);
    }
  }, [sudoku, checkWin, showWinModal]);

  // Initialize on mount
  useEffect(() => {
    generateNewPuzzle(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // State
    difficulty,
    sudoku,
    readOnly,
    notes,
    selectedCell,
    history,
    isPencilMode,
    showWinModal,
    // Actions
    setDifficulty,
    setSelectedCell,
    setIsPencilMode,
    setShowWinModal,
    generateNewPuzzle,
    resetCurrentGame,
    undoLastMove,
    handleNumberInput,
    handleClear,
    // Constants
    GRID_SIZE,
    NUMBERS,
  };
}

