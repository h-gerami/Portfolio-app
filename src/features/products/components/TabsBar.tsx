import React from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { TabType, TABS } from "../types";

export function TabsBar({
  activeKey,
  onChange,
}: {
  activeKey: string;
  onChange: (k: string) => void;
}) {
  const renderItem = ({ item }: ListRenderItemInfo<TabType>) => {
    const isActive = activeKey === item.key;
    return (
      <TouchableOpacity
        onPress={() => onChange(item.key)}
        style={[styles.tabBtn, isActive && styles.tabActive]}
      >
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.tabs}>
      <FlatList
        data={TABS}
        keyExtractor={(t) => t.key}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 2,
    paddingBottom: 6,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
  },
  tabActive: { backgroundColor: "#111827" },
  tabText: { fontWeight: "700", color: "#334155", fontSize: 13 },
  tabTextActive: { color: "white" },
});
