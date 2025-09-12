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
} from "react-native";
import { Image } from "expo-image";
import { User, useUsersList } from "@/hooks/useUsersList";

export default function TestScreen() {
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
    separatorHeight,
    bLoading,
  } = useUsersList(); // all-in-one, no debounce

  const renderItem: ListRenderItem<User> = useCallback(
    ({ item }) => (
      <View style={styles.row}>
        <Image source={{ uri: item.image }} style={styles.avatar} contentFit="cover" />
        <View>
          <Text style={styles.name}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.sub}>ID: {item.id}</Text>
        </View>
      </View>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <Text style={styles.title}>Users ({count})</Text>
        {bLoading && <ActivityIndicator />}
      </View>
      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search first or last name…"
        style={styles.input}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={<Text style={styles.empty}>No users</Text>}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
        // perf props
        windowSize={5}
        initialNumToRender={12}
        removeClippedSubviews
        getItemLayout={getItemLayout}
      />
    </SafeAreaView>
  );
}

const ITEM_HEIGHT = 88;
const styles = StyleSheet.create({
  container: { paddingTop: 40, paddingHorizontal: 16, flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#d0d0d0",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    marginBottom: 12,
  },
  error: { color: "red", marginBottom: 8 },
  empty: { textAlign: "center", padding: 16, color: "#666" },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: "#e6e6e6" },
  row: {
    height: ITEM_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#eee" },
  name: { fontSize: 16, fontWeight: "500" },
  sub: { color: "#666" },
});
