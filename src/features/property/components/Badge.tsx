import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme";

function Badge({ label }: { label: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.chipBg,
    borderWidth: 1,
    borderColor: colors.chipBorder,
  },
  badgeText: { color: "#e5e7eb", fontWeight: "700", fontSize: 12 },
});

export default memo(Badge);
