import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";
import { useCartStore } from "@/src/store/useCartStore";

type CartBadgeProps = {
  size?: number;
  color: string;
};

export function CartBadge({ size = 28, color }: CartBadgeProps) {
  // Subscribe to items to trigger re-render when cart changes
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <View style={styles.container}>
      <IconSymbol size={size} name="bag.fill" color={color} />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {totalItems > 99 ? "99+" : totalItems.toString()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },
});

