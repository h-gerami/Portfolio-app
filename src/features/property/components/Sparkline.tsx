import React, { memo, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../theme";

const Sparkline = ({ data }: { data: number[] }) => {
  const { min, max } = useMemo(
    () => ({ min: Math.min(...data), max: Math.max(...data) }),
    [data],
  );
  const norm = (v: number) => (max === min ? 0.5 : (v - min) / (max - min));

  return (
    <View style={styles.row}>
      {data.map((v, i) => (
        <View key={i} style={[styles.bar, { height: 10 + norm(v) * 30 }]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 3, alignItems: "flex-end", height: 40 },
  bar: { width: 8, borderRadius: 4, backgroundColor: colors.spark },
});

export default memo(Sparkline);
