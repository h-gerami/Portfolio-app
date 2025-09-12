import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SortKey } from "../state";

export function Filters(props: {
  query: string;
  setQuery: (v: string) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  sort: SortKey;
  setSort: (s: SortKey) => void;
  clear: () => void;
}) {
  const {
    query,
    setQuery,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    sort,
    setSort,
    clear,
  } = props;

  return (
    <View style={styles.filterBar}>
      <TextInput
        placeholder="Search title, description, category…"
        placeholderTextColor="#6b7280"
        style={styles.filterInput}
        value={query}
        onChangeText={setQuery}
      />
      <View style={styles.priceRow}>
        <TextInput
          placeholder="Min $"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
          value={minPrice}
          onChangeText={setMinPrice}
          style={styles.priceInput}
        />
        <Text style={styles.toText}>to</Text>
        <TextInput
          placeholder="Max $"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
          value={maxPrice}
          onChangeText={setMaxPrice}
          style={styles.priceInput}
        />
      </View>

      <View style={styles.sortRow}>
        <Pill
          active={sort === "priceAsc"}
          onPress={() => setSort(sort === "priceAsc" ? null : "priceAsc")}
          label="Price ↑"
        />
        <Pill
          active={sort === "priceDesc"}
          onPress={() => setSort(sort === "priceDesc" ? null : "priceDesc")}
          label="Price ↓"
        />
        <Pill
          active={sort === "titleAsc"}
          onPress={() => setSort(sort === "titleAsc" ? null : "titleAsc")}
          label="Title A–Z"
        />
        <TouchableOpacity onPress={clear} style={styles.clearBtn}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Pill = ({
  active,
  onPress,
  label,
}: {
  active: boolean;
  onPress: () => void;
  label: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.sortBtn, active && styles.sortBtnActive]}
  >
    <Text style={[styles.sortText, active && styles.sortTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  filterBar: { paddingHorizontal: 12, paddingBottom: 8, gap: 8 },
  filterInput: {
    backgroundColor: "#f1f5f9",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#0f172a",
  },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  priceInput: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#0f172a",
  },
  toText: { color: "#64748b", fontWeight: "600" },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 2,
  },
  sortBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sortBtnActive: { backgroundColor: "#111827", borderColor: "#111827" },
  sortText: { color: "#334155", fontWeight: "700", fontSize: 12 },
  sortTextActive: { color: "white" },
  clearBtn: {
    marginLeft: "auto",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  clearText: { color: "#991b1b", fontWeight: "700", fontSize: 12 },
});
