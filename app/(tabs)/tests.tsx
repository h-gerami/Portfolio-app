import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSudoku, Difficulty } from "@/hooks/useSudoku";

export default function TestScreen() {
  const {
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
  } = useSudoku();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollContent}>
        {/* Header with Difficulty Selector */}
        <View style={styles.header}>
          <Text style={styles.title}>Sudoku</Text>
          <View style={styles.difficultyContainer}>
            {(["easy", "medium", "hard", "expert"] as const).map((diff) => (
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
      </View>

      {/* Number Selection Modal */}
      {selectedCell !== null && !readOnly[selectedCell.row][selectedCell.col] && (
        <Modal
          visible={selectedCell !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedCell(null)}
        >
          <TouchableOpacity
            style={styles.numberModalOverlay}
            activeOpacity={1}
            onPress={() => setSelectedCell(null)}
          >
            <View style={styles.numberModalContent}>
              <View style={styles.numberGrid}>
                {NUMBERS.map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={styles.numberGridButton}
                    onPress={() => {
                      handleNumberInput(num);
                      setSelectedCell(null);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.numberGridButtonText}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.clearNumberButton}
                onPress={() => {
                  handleClear();
                  setSelectedCell(null);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.clearNumberButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Win Celebration Modal */}
      <Modal
        visible={showWinModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.winEmoji}>🎉</Text>
            <Text style={styles.winTitle}>Congratulations!</Text>
            <Text style={styles.winMessage}>You've completed the Sudoku puzzle!</Text>
            <TouchableOpacity
              style={styles.winButton}
              onPress={() => {
                setShowWinModal(false);
                generateNewPuzzle(difficulty);
              }}
            >
              <Text style={styles.winButtonText}>New Game</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.winButtonSecondary}
              onPress={() => {
                setShowWinModal(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.winButtonTextSecondary}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingTop: 16,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
  header: {
    width: "100%",
    marginBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  difficultyContainer: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  difficultyButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    borderWidth: 2,
    borderColor: "transparent",
  },
  difficultyButtonActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#2563EB",
  },
  difficultyButtonText: {
    fontSize: 12,
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
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
  },
  sudokuRow: {
    flexDirection: "row",
  },
  sudokuCell: {
    width: 38,
    height: 38,
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
    backgroundColor: "#E5E7EB",
  },
  sudokuCellText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  sudokuCellTextReadOnly: {
    fontWeight: "700",
    color: "#111827",
  },
  numberModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  numberModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minWidth: 240,
  },
  numberGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 200,
    gap: 10,
    marginBottom: 20,
    justifyContent: "center",
  },
  numberGridButton: {
    width: 56,
    height: 56,
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  numberGridButtonText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },
  clearNumberButton: {
    backgroundColor: "#FEF2F2",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FEE2E2",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clearNumberButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#DC2626",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    marginTop: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 13,
    fontWeight: "700",
  },
  actionButtonTextDisabled: {
    color: "#9CA3AF",
  },
  pencilModeContainer: {
    width: "100%",
    marginBottom: 12,
    alignItems: "center",
  },
  pencilModeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  pencilModeButtonActive: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
  },
  pencilModeText: {
    fontSize: 12,
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
    padding: 2,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  noteText: {
    fontSize: 8,
    fontWeight: "500",
    color: "#6B7280",
    width: "30%",
    textAlign: "left",
    lineHeight: 9,
  },
  keyboardButtonHighlighted: {
    backgroundColor: "#FEF3C7",
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    width: "85%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  winEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  winTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  winMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  winButton: {
    backgroundColor: "#10B981",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  winButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  winButtonSecondary: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  winButtonTextSecondary: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
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

