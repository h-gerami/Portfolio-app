import React from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native";

type Difficulty = "easy" | "medium" | "hard" | "expert";

const GRID_SIZE = 10; // 10x10 Sudoku
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; // 0-9 for 10x10 grid

// Difficulty presets: number of clues (pre-filled cells) for 10x10 grid
const DIFFICULTY_CLUES: Record<Difficulty, number> = {
  easy: 60,      // ~60% filled
  medium: 50,    // ~50% filled
  hard: 40,      // ~40% filled
  expert: 30,    // ~30% filled
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

    // Check 5x2 box (for 10x10 grid, we use 5x2 boxes)
    const boxRow = Math.floor(row / 5) * 5;
    const boxCol = Math.floor(col / 2) * 2;
    for (let r = boxRow; r < boxRow + 5 && r < GRID_SIZE; r++) {
      for (let c = boxCol; c < boxCol + 2 && c < GRID_SIZE; c++) {
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

// Remove numbers based on difficulty
function removeNumbers(grid: number[][], difficulty: Difficulty): { grid: number[][]; readOnly: boolean[][] } {
  const clues = DIFFICULTY_CLUES[difficulty];
  const totalCells = GRID_SIZE * GRID_SIZE;
  const cellsToRemove = totalCells - clues;

  const result = grid.map(row => [...row]);
  const readOnly = grid.map(row => row.map(() => false));

  // Create list of all positions
  const positions: { row: number; col: number }[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      positions.push({ row: r, col: c });
    }
  }

  // Shuffle and remove
  const shuffled = positions.sort(() => Math.random() - 0.5);
  for (let i = 0; i < cellsToRemove && i < shuffled.length; i++) {
    const { row, col } = shuffled[i];
    result[row][col] = 0;
  }

  // Mark remaining cells as read-only
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (result[r][c] !== 0) {
        readOnly[r][c] = true;
      }
    }
  }

  return { grid: result, readOnly };
}

export default function TestScreen() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [sudoku, setSudoku] = useState<number[][]>(
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0))
  );
  const [readOnly, setReadOnly] = useState<boolean[][]>(
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false))
  );
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const generateNewPuzzle = (newDifficulty: Difficulty) => {
    const solution = generateSudokuSolution();
    const { grid, readOnly: readonly } = removeNumbers(solution, newDifficulty);
    setSudoku(grid);
    setReadOnly(readonly);
    setSelectedCell(null);
    setDifficulty(newDifficulty);
  };

  const handleNumberInput = (num: number) => {
    if (selectedCell && !readOnly[selectedCell.row][selectedCell.col]) {
      setSudoku((prev) => {
        const copy = prev.map((r) => [...r]);
        copy[selectedCell.row][selectedCell.col] = num;
        return copy;
      });
    }
  };

  const handleClear = () => {
    if (selectedCell && !readOnly[selectedCell.row][selectedCell.col]) {
      setSudoku((prev) => {
        const copy = prev.map((r) => [...r]);
        copy[selectedCell.row][selectedCell.col] = 0;
        return copy;
      });
    }
  };

  // Initialize on mount
  React.useEffect(() => {
    generateNewPuzzle(difficulty);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
                onPress={() => generateNewPuzzle(diff)}
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
                const isBoxBorder = col % 2 === 0 && col > 0;
                const isBoxBorderBottom = row % 5 === 0 && row > 0;

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
                    <Text
                      style={[
                        styles.sudokuCellText,
                        isReadOnly && styles.sudokuCellTextReadOnly,
                      ]}
                    >
                      {sudoku[row][col] > 0 ? sudoku[row][col].toString() : ""}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Number Keyboard */}
        {selectedCell !== null && !readOnly[selectedCell.row][selectedCell.col] && (
          <View style={styles.keyboardContainer}>
            <Text style={styles.keyboardTitle}>
              Selected: Row {selectedCell.row + 1}, Col {selectedCell.col + 1}
            </Text>
            <View style={styles.keyboard}>
              {NUMBERS.map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => handleNumberInput(num)}
                  style={styles.keyboardButton}
                >
                  <Text style={styles.keyboardButtonText}>{num}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={handleClear}
                style={[styles.keyboardButton, styles.clearButton]}
              >
                <Text style={styles.keyboardButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedCell(null)}
                style={[styles.keyboardButton, styles.doneButton]}
              >
                <Text style={styles.keyboardButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

          {selectedCell === null && (
            <Text style={styles.hintText}>
              Tap an empty cell to select it, then enter a number (0-9)
            </Text>
          )}

        {/* New Game Button */}
        <TouchableOpacity
          style={styles.newGameButton}
          onPress={() => generateNewPuzzle(difficulty)}
        >
          <Text style={styles.newGameButtonText}>New Game</Text>
        </TouchableOpacity>
      </ScrollView>
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
    padding: 16,
    paddingTop: 20,
    alignItems: "center",
    paddingBottom: 40,
  },
  header: {
    width: "100%",
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },
  difficultyContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  difficultyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 2,
    borderColor: "transparent",
  },
  difficultyButtonActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#2563EB",
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  difficultyButtonTextActive: {
    color: "#FFFFFF",
  },
  sudokuContainer: {
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  sudokuRow: {
    flexDirection: "row",
  },
  sudokuCell: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  cellLeftBorder: {
    borderLeftWidth: 3,
    borderLeftColor: "#111827",
  },
  cellTopBorder: {
    borderTopWidth: 3,
    borderTopColor: "#111827",
  },
  sudokuCellSelected: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6",
    borderWidth: 2,
  },
  sudokuCellReadOnly: {
    backgroundColor: "#F9FAFB",
  },
  sudokuCellText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  sudokuCellTextReadOnly: {
    fontWeight: "700",
    color: "#111827",
  },
  keyboardContainer: {
    width: "100%",
    marginTop: 24,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  keyboardTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  keyboard: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  keyboardButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 50,
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
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  hintText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 16,
    marginBottom: 8,
  },
  newGameButton: {
    marginTop: 24,
    backgroundColor: "#10B981",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  newGameButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
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

