import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "./theme";
import { useDarkTabBar } from "./hooks/useDarkTabBar";
import StatusBarFill from "./components/StatusBarFill";
import PropertyCard from "./components/PropertyCard";
import { SAMPLE } from "./data/sample";

export default function HomerInspiredScreen() {
  const { isFocused } = useDarkTabBar();
  const heroLine = useMemo(
    () => "See through the noise:\nprice history, auctions, agent insights",
    [],
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {isFocused && (
        <>
          <StatusBar style="light" translucent />
          <StatusBarFill color={colors.bg} />
        </>
      )}

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>Homer</Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.homerapp.com.au/homer-extension")
            }
          >
            <Text style={styles.linkText}>Install Chrome Extension →</Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.h1}>Your copilot for Aussie property</Text>
          <Text style={styles.h2}>{heroLine}</Text>

          <View style={styles.searchRow}>
            <TextInput
              placeholder="Search suburb, address or agent…"
              placeholderTextColor="#9aa3af"
              style={styles.input}
            />
            <TouchableOpacity style={styles.searchBtn}>
              <Text style={styles.searchBtnText}>Search</Text>
            </TouchableOpacity>
          </View>

          {/* Quick insights */}
          <View style={styles.insightsRow}>
            <View style={styles.insight}>
              <Text style={styles.insightLabel}>Price history</Text>
              <Text style={styles.insightValue}>7yr trend</Text>
            </View>
            <View style={styles.insight}>
              <Text style={styles.insightLabel}>Auction results</Text>
              <Text style={styles.insightValue}>Sold/PI</Text>
            </View>
            <View style={styles.insight}>
              <Text style={styles.insightLabel}>Agent variance</Text>
              <Text style={styles.insightValue}>±%</Text>
            </View>
            <View style={styles.insight}>
              <Text style={styles.insightLabel}>Gross yield</Text>
              <Text style={styles.insightValue}>3–5%</Text>
            </View>
          </View>
        </View>

        {/* Results header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shortlist</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Cards */}
        {SAMPLE.map((p) => (
          <PropertyCard key={p.id} p={p} />
        ))}

        {/* Bottom CTA */}
        <View style={styles.bottomCard}>
          <Text style={styles.bottomTitle}>Negotiate with confidence</Text>
          <Text style={styles.bottomCopy}>
            Use price history, agent variance and auction outcomes to set your
            walk-away number.
          </Text>
          <TouchableOpacity
            style={styles.ctaDarkFull}
            onPress={() =>
              Linking.openURL("https://www.homerapp.com.au/homer-product")
            }
          >
            <Text style={styles.ctaDarkText}>Learn how insights work</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footnote}>
          Inspired by buyer-first insights: price history, auction results,
          agent variance & yields.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, backgroundColor: colors.bg },

  header: {
    paddingTop: 6,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 0.2,
  },
  linkText: { color: colors.accent, fontWeight: "600" },

  hero: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 8 },
  h1: { color: colors.text, fontSize: 22, fontWeight: "800", marginBottom: 6 },
  h2: { color: "#cbd5e1", fontSize: 14, lineHeight: 20, marginBottom: 14 },

  searchRow: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    backgroundColor: colors.inputBg,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
  },
  searchBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    borderRadius: 10,
    justifyContent: "center",
  },
  searchBtnText: { color: colors.text, fontWeight: "700" },

  insightsRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  insight: {
    flex: 1,
    backgroundColor: colors.chipBg,
    borderColor: colors.chipBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  insightLabel: { color: "#9aa3af", fontSize: 12, marginBottom: 4 },
  insightValue: { color: "#e5e7eb", fontWeight: "700" },

  sectionHeader: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { color: colors.text, fontWeight: "800", fontSize: 16 },
  sectionLink: { color: colors.accent, fontWeight: "600" },

  ctaDarkFull: {
    backgroundColor: colors.dark,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.darkBorder,
  },
  ctaDarkText: { color: colors.text, fontWeight: "800" },

  bottomCard: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  bottomTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 6,
  },
  bottomCopy: { color: "#cbd5e1" },

  footnote: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 12,
    marginTop: 14,
  },
});
