import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Filters } from "./Filters";
import { TabsBar } from "./TabsBar";
import { TopLoadingBar } from "./TopLoadingBar";
import { useApplyFilters, useProductFilters } from "../state";
import { TABS } from "../types";
import {
  useFlattenPages,
  useGlobalIsFetching,
  usePrefetchAll,
  useProductsInfinite,
} from "../hooks";
import { ProductsList } from "./ProductList";

export default function ProductsScreen() {
  usePrefetchAll(); // optional optimization

  const [activeKey, setActiveKey] = useState<string>(TABS[0].key);
  const rq = useProductsInfinite(activeKey);
  const allItems = useFlattenPages(rq.data?.pages);
  const filters = useProductFilters();
  const filtered = useApplyFilters(allItems, filters);

  const hasNext = rq.hasNextPage ?? false;
  const refreshing = rq.isRefetching && !rq.isFetchingNextPage;
  const isLoadingInitial = rq.isLoading;
  const topBarVisible = useGlobalIsFetching();

  const errorBanner = rq.error ? (
    <View style={styles.errorBanner}>
      <Text style={styles.errorText}>Error: {rq.error.message}</Text>
      <TouchableOpacity
        onPress={() => rq.refetch()}
        style={[styles.button, { marginTop: 8 }]}
      >
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  ) : null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Popular Products</Text>
        <TopLoadingBar visible={topBarVisible} />
        <Filters {...filters} />
        <TabsBar activeKey={activeKey} onChange={setActiveKey} />
      </View>

      {errorBanner}

      <ProductsList
        items={filtered}
        isLoading={isLoadingInitial}
        isFetchingNextPage={rq.isFetchingNextPage}
        hasNextPage={rq.hasNextPage}
        onRefresh={() => rq.refetch()}
        onEndReached={() => hasNext && rq.fetchNextPage()}
        refreshing={refreshing}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    backgroundColor: "white",
    paddingTop: 40,
    paddingBottom: 10,
    borderBottomColor: "#e5e7eb",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontWeight: "800",
    fontSize: 18,
    paddingHorizontal: 16,
    color: "#0f172a",
    paddingBottom: 6,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#111827",
  },
  buttonText: { color: "white", fontWeight: "700" },
  errorBanner: {
    padding: 12,
    backgroundColor: "#fee2e2",
    borderBottomColor: "#fecaca",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  errorText: { color: "#b91c1c", fontWeight: "700" },
});
