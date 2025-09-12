import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Product } from "../types";

export function ProductRow({ item }: { item: Product }) {
  const img = item.thumbnail ?? item.images?.[0];
  return (
    <View style={styles.row}>
      <Image source={{ uri: img }} style={styles.thumb} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.desc}>
          {item.description}
        </Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "white",
  },
  thumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: "#f3f4f6" },
  title: { fontWeight: "600", fontSize: 16, marginBottom: 4, color: "#0f172a" },
  desc: { color: "#6b7280", fontSize: 13, marginBottom: 6 },
  price: { fontWeight: "600", color: "#0f172a" },
});
