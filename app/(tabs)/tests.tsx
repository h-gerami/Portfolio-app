import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { User, useUsersList } from "@/hooks/useUsersList";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TestScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  
  const {
    data,
    count,
    loading,
    error,
    searchText,
    setSearchText,
    keyExtractor,
    getItemLayout,
    onRefresh,
    onRetry,
    separatorHeight,
    isSearching,
    retryCount,
    canRetry,
  } = useUsersList();

  const renderItem: ListRenderItem<User> = useCallback(
    ({ item }) => {
      const dynamicStyles = StyleSheet.create({
        name: {
          ...styles.name,
          color: colors.text,
        },
        sub: {
          ...styles.sub,
          color: colors.icon,
        },
      });

      return (
        <View style={styles.row} accessibilityRole="button" accessibilityLabel={`User ${item.firstName} ${item.lastName}`}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.avatar} 
            contentFit="cover"
            placeholder="👤"
            accessibilityLabel={`Avatar for ${item.firstName} ${item.lastName}`}
          />
          <View style={styles.userInfo}>
            <Text style={dynamicStyles.name}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={dynamicStyles.sub}>ID: {item.id}</Text>
          </View>
        </View>
      );
    },
    [colors],
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      ...styles.container,
      backgroundColor: colors.background,
    },
    title: {
      ...styles.title,
      color: colors.text,
    },
    input: {
      ...styles.input,
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fafafa',
      borderColor: colorScheme === 'dark' ? '#444' : '#d0d0d0',
      color: colors.text,
    },
    error: {
      ...styles.error,
      color: colorScheme === 'dark' ? '#ff6b6b' : '#d32f2f',
    },
    empty: {
      ...styles.empty,
      color: colors.icon,
    },
    name: {
      ...styles.name,
      color: colors.text,
    },
    sub: {
      ...styles.sub,
      color: colors.icon,
    },
    sep: {
      ...styles.sep,
      backgroundColor: colorScheme === 'dark' ? '#444' : '#e6e6e6',
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={styles.header}>
        <Text style={dynamicStyles.title}>Users ({count})</Text>
        {(loading || isSearching) && <ActivityIndicator size="small" color={colors.tint} />}
      </View>
      
      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search first or last name…"
        placeholderTextColor={colors.icon}
        style={dynamicStyles.input}
        accessibilityLabel="Search users"
        accessibilityHint="Type to search for users by first or last name"
      />
      
      {!!error && (
        <View style={[styles.errorContainer, { backgroundColor: colorScheme === 'dark' ? '#3a1a1a' : '#ffe6e6' }]}>
          <Text style={dynamicStyles.error}>{error}</Text>
          {canRetry && (
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: colorScheme === 'dark' ? '#ff6b6b' : '#d32f2f' }]} 
              onPress={onRetry}
              accessibilityLabel="Retry loading users"
              accessibilityHint="Tap to retry loading users"
            >
              <Text style={styles.retryText}>
                Retry {retryCount > 0 && `(${retryCount}/3)`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={() => <View style={dynamicStyles.sep} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={dynamicStyles.empty}>
              {searchText ? "No users found matching your search" : "No users available"}
            </Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
        // Performance optimizations
        windowSize={5}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews
        getItemLayout={getItemLayout}
        accessibilityLabel="Users list"
      />
    </SafeAreaView>
  );
}

const ITEM_HEIGHT = 88;
const SEPARATOR_HEIGHT = StyleSheet.hairlineWidth;

const styles = StyleSheet.create({
  container: { 
    paddingTop: 40, 
    paddingHorizontal: 16, 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginBottom: 8,
  },
  title: { 
    fontSize: 18, 
    fontWeight: "600",
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d0d0d0",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    marginBottom: 12,
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: "#ffe6e6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  error: { 
    color: "#d32f2f", 
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: "#d32f2f",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  empty: { 
    textAlign: "center", 
    color: "#666",
    fontSize: 16,
  },
  sep: { 
    height: SEPARATOR_HEIGHT, 
    backgroundColor: "#e6e6e6",
    marginLeft: 68, // Align with text content
  },
  row: {
    height: ITEM_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  avatar: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: "#eee",
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  name: { 
    fontSize: 16, 
    fontWeight: "500",
    color: "#000",
  },
  sub: { 
    color: "#666",
    fontSize: 14,
    marginTop: 2,
  },
});
