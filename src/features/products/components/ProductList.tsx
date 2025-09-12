import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { Product } from "../types";
import { ProductRow } from "./ProductRow";

export function ProductsList(props: {
  items: Product[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  refreshing: boolean;
}) {
  const keyExtractor = useCallback((it: Product) => String(it.id), []);

  const ListFooter = useCallback(() => {
    if (!props.isFetchingNextPage) {
      if (props.hasNextPage === false && props.items.length > 0) {
        return (
          <View style={[styles.center, { paddingVertical: 16 }]}>
            <Text style={{ color: "#6b7280" }}>You’re all caught up 🎉</Text>
          </View>
        );
      }
      return null;
    }
    return (
      <View style={[styles.center, { paddingVertical: 16 }]}>
        <ActivityIndicator />
      </View>
    );
  }, [props.isFetchingNextPage, props.hasNextPage, props.items.length]);

  if (props.isLoading) {
    return (
      <View style={[styles.center, { flex: 1 }]}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading…</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={props.items}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => <ProductRow item={item} />}
      ListFooterComponent={ListFooter}
      refreshControl={
        <RefreshControl
          refreshing={props.refreshing}
          onRefresh={props.onRefresh}
        />
      }
      onEndReached={props.onEndReached}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
      maxToRenderPerBatch={16}
      updateCellsBatchingPeriod={16}
      windowSize={7}
      removeClippedSubviews
      contentContainerStyle={{ paddingBottom: 12 }}
    />
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center", padding: 24 },
});
