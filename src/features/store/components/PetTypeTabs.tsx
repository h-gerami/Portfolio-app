import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { PetTypeTab } from "../types";

type PetTypeTabsProps = {
  petTypes: PetTypeTab[];
  activeKey: string;
  onSelect: (key: string) => void;
};

export function PetTypeTabs({
  petTypes,
  activeKey,
  onSelect,
}: PetTypeTabsProps) {
  const renderTab = ({ item }: { item: PetTypeTab }) => {
    const isActive = activeKey === item.key;

    return (
      <TouchableOpacity
        style={[styles.tab, isActive && styles.tabActive]}
        onPress={() => onSelect(item.key)}
        activeOpacity={0.7}
      >
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={petTypes}
        renderItem={renderTab}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  content: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: "#111827",
  },
  emoji: {
    fontSize: 16,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
});

