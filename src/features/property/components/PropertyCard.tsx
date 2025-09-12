import React, { memo } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Property } from "../types";
import { colors } from "../theme";
import Sparkline from "./Sparkline";
import Badge from "./Badge";

type Props = {
  p: Property;
  onSave?: (p: Property) => void;
  onCompare?: (p: Property) => void;
};

function PropertyCard({ p, onSave, onCompare }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: p.image }} style={styles.cardImg} />
      <View style={{ padding: 12 }}>
        <Text style={styles.cardTitle}>{p.title}</Text>
        <Text style={styles.cardAddr}>{p.address}</Text>

        <View style={styles.badgeRow}>
          <Badge label={`${p.bed} 🛏`} />
          <Badge label={`${p.bath} 🛁`} />
          <Badge label={`${p.car} 🚗`} />
        </View>

        <View style={styles.kvRow}>
          <View style={styles.kv}>
            <Text style={styles.kvLabel}>Guide</Text>
            <Text style={styles.kvValue}>{p.priceGuide}</Text>
          </View>
          <View style={styles.kv}>
            <Text style={styles.kvLabel}>Last sold</Text>
            <Text style={styles.kvValue}>{p.lastSoldPrice ?? "—"}</Text>
          </View>
        </View>

        <View style={{ marginTop: 8 }}>
          <Text style={styles.subtle}>Price history</Text>
          <Sparkline data={p.priceHistory} />
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaTag}>Auction: {p.auctionResults}</Text>
          <Text style={styles.metaTag}>Yield: {p.rentalYield}</Text>
        </View>
        <View style={{ marginTop: 4 }}>
          <Text style={styles.variantTag}>
            Agent variance: {p.agentVariance}
          </Text>
        </View>

        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.ctaGhost} onPress={() => onSave?.(p)}>
            <Text style={styles.ctaGhostText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctaDark}
            onPress={() => onCompare?.(p)}
          >
            <Text style={styles.ctaDarkText}>Compare</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
    marginHorizontal: 16,
    marginTop: 10,
  },
  cardImg: { width: "100%", height: 170, backgroundColor: colors.dark },
  cardTitle: { color: colors.text, fontWeight: "800", fontSize: 16 },
  cardAddr: { color: colors.textMuted, marginTop: 2 },

  badgeRow: { flexDirection: "row", gap: 6, marginTop: 8 },

  kvRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  kv: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 10,
    padding: 10,
  },
  kvLabel: { color: "#9aa3af", fontSize: 12 },
  kvValue: { color: "#e5e7eb", fontWeight: "700" },

  subtle: { color: colors.textMuted, fontSize: 12, marginBottom: 6 },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  metaTag: { color: colors.textSubtle, fontSize: 12 },
  variantTag: { color: colors.gold, fontSize: 12, fontWeight: "700" },

  ctaRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  ctaGhost: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#334155",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  ctaGhostText: { color: "#e5e7eb", fontWeight: "700" },
  ctaDark: {
    flex: 1,
    backgroundColor: colors.dark,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.darkBorder,
  },
  ctaDarkText: { color: colors.text, fontWeight: "800" },
});

export default memo(PropertyCard);
