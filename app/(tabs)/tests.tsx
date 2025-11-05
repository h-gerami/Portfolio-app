import React from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";

type Difficulty = "easy" | "medium" | "hard" | "expert";

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

type MoveHistory = {
  row: number;
  col: number;
  previousValue: number;
  previousNotes: number[];
};

export default function TestScreen() {
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
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [history, setHistory] = useState<MoveHistory[]>([]);
  const [isPencilMode, setIsPencilMode] = useState(false);

  const generateNewPuzzle = React.useCallback((newDifficulty: Difficulty) => {
    // Generate puzzle synchronously to avoid delay
    const solution = generateSudokuSolution();
    const { grid, readOnly: readonly } = removeNumbers(solution, newDifficulty);
    setSudoku(grid);
    setReadOnly(readonly);
    setNotes(Array.from({ length: GRID_SIZE }, () => 
      Array.from({ length: GRID_SIZE }, () => [])
    ));
    setSelectedCell(null);
    setHistory([]);
    setDifficulty(newDifficulty);
    setIsPencilMode(false);
  }, []);

  const resetCurrentGame = React.useCallback(() => {
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

  const undoLastMove = React.useCallback(() => {
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

  const handleNumberInput = (num: number) => {
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
  };

  const handleClear = () => {
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
  };

  // Initialize on mount
  React.useEffect(() => {
    generateNewPuzzle(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollContent}>
        {/* Header with Difficulty Selector */}
        <View style={styles.header}>
          <Text style={styles.title}>Sudoku</Text>
          <View style={styles.difficultyContainer}>
            {(["easy", "medium", "hard", "expert"] as Difficulty[]).map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.difficultyButton,
                  difficulty === diff && styles.difficultyButtonActive,
                ]}
                onPress={() => {
                  // Immediate visual feedback
                  setDifficulty(diff);
                  // Generate puzzle (optimized)
                  generateNewPuzzle(diff);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.difficultyButtonText,
                    difficulty === diff && styles.difficultyButtonTextActive,
                  ]}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 9x9 Sudoku Grid */}
        <View style={styles.sudokuContainer}>
          {Array.from({ length: GRID_SIZE }).map((_, row) => (
            <View key={row} style={styles.sudokuRow}>
              {Array.from({ length: GRID_SIZE }).map((_, col) => {
                const isSelected =
                  selectedCell?.row === row && selectedCell?.col === col;
                const isReadOnly = readOnly[row][col];
                const isBoxBorder = col % 3 === 0 && col > 0;
                const isBoxBorderBottom = row % 3 === 0 && row > 0;

                return (
                  <TouchableOpacity
                    key={col}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (!isReadOnly) {
                        setSelectedCell({ row, col });
                      }
                    }}
                    disabled={isReadOnly}
                    style={[
                      styles.sudokuCell,
                      isBoxBorder && styles.cellLeftBorder,
                      isBoxBorderBottom && styles.cellTopBorder,
                      isSelected && styles.sudokuCellSelected,
                      isReadOnly && styles.sudokuCellReadOnly,
                    ]}
                  >
                    {/* Main number */}
                    {sudoku[row][col] > 0 ? (
                      <Text
                        style={[
                          styles.sudokuCellText,
                          isReadOnly && styles.sudokuCellTextReadOnly,
                        ]}
                      >
                        {sudoku[row][col].toString()}
                      </Text>
                    ) : notes[row][col].length > 0 ? (
                      <View style={styles.notesContainer}>
                        {notes[row][col].slice(0, 6).map((note, idx) => (
                          <Text key={idx} style={styles.noteText}>
                            {note}
                          </Text>
                        ))}
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.undoButton, history.length === 0 && styles.actionButtonDisabled]}
            onPress={undoLastMove}
            disabled={history.length === 0}
          >
            <Text style={[styles.actionButtonText, history.length === 0 && styles.actionButtonTextDisabled]}>
              ↶ Undo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.resetButton]}
            onPress={resetCurrentGame}
          >
            <Text style={styles.actionButtonText}>↻ Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Pencil Mode Toggle */}
        <View style={styles.pencilModeContainer}>
          <TouchableOpacity
            style={[styles.pencilModeButton, isPencilMode && styles.pencilModeButtonActive]}
            onPress={() => setIsPencilMode(!isPencilMode)}
          >
            <Text style={[styles.pencilModeText, isPencilMode && styles.pencilModeTextActive]}>
              ✏️ {isPencilMode ? "Pencil Mode" : "Pen Mode"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Number Keyboard */}
        {selectedCell !== null && !readOnly[selectedCell.row][selectedCell.col] && (
          <View style={styles.keyboardContainer}>
            <View style={styles.keyboard}>
              {NUMBERS.map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => handleNumberInput(num)}
                  style={[
                    styles.keyboardButton,
                    notes[selectedCell.row][selectedCell.col].includes(num) && styles.keyboardButtonHighlighted,
                  ]}
                >
                  <Text style={styles.keyboardButtonText}>{num}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={handleClear}
                style={[styles.keyboardButton, styles.clearButton]}
              >
                <Text style={styles.keyboardButtonText}>C</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
































// import React, { useCallback } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   ListRenderItem,
//   RefreshControl,
//   StyleSheet,
//   SafeAreaView,
//   TextInput,
//   ActivityIndicator,
//   TouchableOpacity,
// } from "react-native";
// import { Image } from "expo-image";
// import { User, useUsersList } from "@/hooks/useUsersList";
// import { Colors } from "@/constants/Colors";
// import { useColorScheme } from "@/hooks/useColorScheme";

// export default function TestScreen() {
//   const colorScheme = useColorScheme() ?? "light";
//   const colors = Colors[colorScheme];
  
//   const {
//     data,
//     count,
//     loading,
//     error,
//     searchText,
//     setSearchText,
//     keyExtractor,
//     getItemLayout,
//     onRefresh,
//     onRetry,
//     separatorHeight,
//     isSearching,
//     retryCount,
//     canRetry,
//   } = useUsersList();

//   const renderItem: ListRenderItem<User> = useCallback(
//     ({ item }) => {
//       const dynamicStyles = StyleSheet.create({
//         name: {
//           ...styles.name,
//           color: colors.text,
//         },
//         sub: {
//           ...styles.sub,
//           color: colors.icon,
//         },
//       });

//       return (
//         <View style={styles.row} accessibilityRole="button" accessibilityLabel={`User ${item.firstName} ${item.lastName}`}>
//           <Image 
//             source={{ uri: item.image }} 
//             style={styles.avatar} 
//             contentFit="cover"
//             placeholder="👤"
//             accessibilityLabel={`Avatar for ${item.firstName} ${item.lastName}`}
//           />
//           <View style={styles.userInfo}>
//             <Text style={dynamicStyles.name}>
//               {item.firstName} {item.lastName}
//             </Text>
//             <Text style={dynamicStyles.sub}>ID: {item.id}</Text>
//           </View>
//         </View>
//       );
//     },
//     [colors],
//   );

//   const dynamicStyles = StyleSheet.create({
//     container: {
//       ...styles.container,
//       backgroundColor: colors.background,
//     },
//     title: {
//       ...styles.title,
//       color: colors.text,
//     },
//     input: {
//       ...styles.input,
//       backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fafafa',
//       borderColor: colorScheme === 'dark' ? '#444' : '#d0d0d0',
//       color: colors.text,
//     },
//     error: {
//       ...styles.error,
//       color: colorScheme === 'dark' ? '#ff6b6b' : '#d32f2f',
//     },
//     empty: {
//       ...styles.empty,
//       color: colors.icon,
//     },
//     name: {
//       ...styles.name,
//       color: colors.text,
//     },
//     sub: {
//       ...styles.sub,
//       color: colors.icon,
//     },
//     sep: {
//       ...styles.sep,
//       backgroundColor: colorScheme === 'dark' ? '#444' : '#e6e6e6',
//     },
//   });

//   return (
//     <SafeAreaView style={dynamicStyles.container}>
//       <View style={styles.header}>
//         <Text style={dynamicStyles.title}>Users ({count})</Text>
//         {(loading || isSearching) && <ActivityIndicator size="small" color={colors.tint} />}
//       </View>
      
//       <TextInput
//         value={searchText}
//         onChangeText={setSearchText}
//         placeholder="Search first or last name…"
//         placeholderTextColor={colors.icon}
//         style={dynamicStyles.input}
//         accessibilityLabel="Search users"
//         accessibilityHint="Type to search for users by first or last name"
//       />
      
//       {!!error && (
//         <View style={[styles.errorContainer, { backgroundColor: colorScheme === 'dark' ? '#3a1a1a' : '#ffe6e6' }]}>
//           <Text style={dynamicStyles.error}>{error}</Text>
//           {canRetry && (
//             <TouchableOpacity 
//               style={[styles.retryButton, { backgroundColor: colorScheme === 'dark' ? '#ff6b6b' : '#d32f2f' }]} 
//               onPress={onRetry}
//               accessibilityLabel="Retry loading users"
//               accessibilityHint="Tap to retry loading users"
//             >
//               <Text style={styles.retryText}>
//                 Retry {retryCount > 0 && `(${retryCount}/3)`}
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       )}

//       <FlatList
//         data={data}
//         renderItem={renderItem}
//         keyExtractor={keyExtractor}
//         ItemSeparatorComponent={() => <View style={dynamicStyles.sep} />}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={dynamicStyles.empty}>
//               {searchText ? "No users found matching your search" : "No users available"}
//             </Text>
//           </View>
//         }
//         refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
//         // Performance optimizations
//         windowSize={5}
//         initialNumToRender={12}
//         maxToRenderPerBatch={10}
//         updateCellsBatchingPeriod={50}
//         removeClippedSubviews
//         getItemLayout={getItemLayout}
//         accessibilityLabel="Users list"
//       />
//     </SafeAreaView>
//   );
// }

// const ITEM_HEIGHT = 88;
// const SEPARATOR_HEIGHT = StyleSheet.hairlineWidth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    padding: 8,
    paddingTop: 8,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
  header: {
    width: "100%",
    marginBottom: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  difficultyContainer: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  difficultyButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  difficultyButtonActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#2563EB",
  },
  difficultyButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
  },
  difficultyButtonTextActive: {
    color: "#FFFFFF",
  },
  sudokuContainer: {
    backgroundColor: "#FFFFFF",
    padding: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 8,
  },
  sudokuRow: {
    flexDirection: "row",
  },
  sudokuCell: {
    width: 28,
    height: 28,
    borderWidth: 0.5,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  cellLeftBorder: {
    borderLeftWidth: 2,
    borderLeftColor: "#111827",
  },
  cellTopBorder: {
    borderTopWidth: 2,
    borderTopColor: "#111827",
  },
  sudokuCellSelected: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6",
    borderWidth: 1.5,
  },
  sudokuCellReadOnly: {
    backgroundColor: "#F9FAFB",
  },
  sudokuCellText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  sudokuCellTextReadOnly: {
    fontWeight: "700",
    color: "#111827",
  },
  keyboardContainer: {
    width: "100%",
    marginTop: 6,
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  keyboard: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  keyboardButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButton: {
    backgroundColor: "#FEE2E2",
  },
  doneButton: {
    backgroundColor: "#D1D5DB",
  },
  keyboardButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 6,
    width: "100%",
    marginTop: 6,
    marginBottom: 6,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  undoButton: {
    backgroundColor: "#3B82F6",
  },
  resetButton: {
    backgroundColor: "#EF4444",
  },
  actionButtonDisabled: {
    backgroundColor: "#D1D5DB",
    opacity: 0.5,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  actionButtonTextDisabled: {
    color: "#9CA3AF",
  },
  pencilModeContainer: {
    width: "100%",
    marginBottom: 6,
    alignItems: "center",
  },
  pencilModeButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  pencilModeButtonActive: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
  },
  pencilModeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
  },
  pencilModeTextActive: {
    color: "#F59E0B",
  },
  notesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
    padding: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  noteText: {
    fontSize: 7,
    fontWeight: "500",
    color: "#6B7280",
    width: "30%",
    textAlign: "left",
    lineHeight: 8,
  },
  keyboardButtonHighlighted: {
    backgroundColor: "#FEF3C7",
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
});

// const styles = StyleSheet.create({
//   container: { 
//     paddingTop: 40, 
//     paddingHorizontal: 16, 
//     flex: 1, 
//     backgroundColor: "#fff" 
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 10,
//     marginBottom: 8,
//   },
//   title: { 
//     fontSize: 18, 
//     fontWeight: "600",
//     flex: 1,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#d0d0d0",
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 8,
//     backgroundColor: "#fafafa",
//     marginBottom: 12,
//     fontSize: 16,
//   },
//   errorContainer: {
//     backgroundColor: "#ffe6e6",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//     alignItems: "center",
//   },
//   error: { 
//     color: "#d32f2f", 
//     fontSize: 14,
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   retryButton: {
//     backgroundColor: "#d32f2f",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 6,
//   },
//   retryText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   emptyContainer: {
//     padding: 32,
//     alignItems: "center",
//   },
//   empty: { 
//     textAlign: "center", 
//     color: "#666",
//     fontSize: 16,
//   },
//   sep: { 
//     height: SEPARATOR_HEIGHT, 
//     backgroundColor: "#e6e6e6",
//     marginLeft: 68, // Align with text content
//   },
//   row: {
//     height: ITEM_HEIGHT,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//   },
//   avatar: { 
//     width: 56, 
//     height: 56, 
//     borderRadius: 28, 
//     backgroundColor: "#eee",
//     marginRight: 12,
//   },
//   userInfo: {
//     flex: 1,
//   },
//   name: { 
//     fontSize: 16, 
//     fontWeight: "500",
//     color: "#000",
//   },
//   sub: { 
//     color: "#666",
//     fontSize: 14,
//     marginTop: 2,
//   },
// });

