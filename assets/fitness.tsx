import React from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Rich, colorful palette inspired by Fitness Passport
const Colors = {
  primary: "#0B6BFF", // FP blue
  primaryDark: "#0847B8",
  aqua: "#13C6D8", // aqua accent
  teal: "#17D3C0",
  purple: "#6E62FF",
  pink: "#FF5DA2",
  lemon: "#FFE26E",
  ink: "#101828",
  slate: "#344054",
  bg: "#F5F8FF", // app background
  card: "#FFFFFF",
  cardAlt: "#F7FAFF",
  border: "#E6E9F5",
  muted: "#667085",
};

export default function FitnessPassportScreen() {
  const facilities = [
    { id: "1", name: "City 24/7 Gym", distance: "0.8 km", tag: "24/7", icon: "dumbbell" },
    { id: "2", name: "Harbour Swim Centre", distance: "2.1 km", tag: "Aquatic", icon: "swim" },
    { id: "3", name: "Centennial Run Track", distance: "1.3 km", tag: "Outdoor", icon: "run" },
    { id: "4", name: "Bondi Yoga Studio", distance: "3.4 km", tag: "Yoga", icon: "meditation" },
  ];

  const plans = [
    {
      id: "std",
      name: "Standard",
      price: "$19.9/wk",
      gradient: [Colors.primary, Colors.aqua],
      features: ["1600+ facilities", "Unlimited visits", "Digital pass"],
    },
    {
      id: "fam",
      name: "Family",
      price: "$29.9/wk",
      gradient: [Colors.purple, Colors.pink],
      features: ["Add family members", "Great value", "Aquatic + gyms"],
    },
    {
      id: "plus",
      name: "Plus",
      price: "$36.9/wk",
      gradient: [Colors.teal, Colors.primary],
      features: ["Pilates & yoga", "Priority support", "Rewards"],
    },
  ];

  const steps = [
    {
      id: "s1",
      icon: "account-check",
      title: "Join",
      copy: "Sign up with your employer eligibility.",
    },
    {
      id: "s2",
      icon: "ticket-confirmation",
      title: "Activate",
      copy: "Get your digital pass instantly.",
    },
    { id: "s3", icon: "qrcode", title: "Check-in", copy: "Scan at any partner facility." },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* ===== Header ===== */}
        <View style={styles.header}>
          <Text style={styles.brand}>FitnessPass</Text>
          <Pressable style={styles.headerLink}>
            <Text style={styles.headerLinkText}>Help</Text>
          </Pressable>
        </View>

        {/* ===== Hero with search ===== */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.heroEyebrow}>Your pass to healthier days</Text>
            <Text style={styles.heroTitle}>
              Unlimited access,
              <Text style={{ color: Colors.lemon }}> great value</Text>
            </Text>
            <View style={styles.heroPillsRow}>
              <View style={[styles.pill, { backgroundColor: "#EAF2FF" }]}>
                <Text style={styles.pillText}>Gyms</Text>
              </View>
              <View style={[styles.pill, { backgroundColor: "#EFFFF7" }]}>
                <Text style={[styles.pillText, { color: "#059669" }]}>Aquatic</Text>
              </View>
              <View style={[styles.pill, { backgroundColor: "#F8E8FF" }]}>
                <Text style={[styles.pillText, { color: Colors.purple }]}>Pilates</Text>
              </View>
            </View>

            {/* Search bar */}
            <View style={styles.searchRow}>
              <View style={styles.searchInputWrap}>
                <MaterialCommunityIcons name="magnify" size={18} color="#5B6A86" />
                <TextInput
                  placeholder="Search suburb, gym or pool…"
                  placeholderTextColor="#94A3B8"
                  style={styles.searchInput}
                />
              </View>
              <Pressable style={styles.searchBtn}>
                <Text style={styles.searchBtnText}>Search</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.heroBadge}>
            <MaterialCommunityIcons name="ticket-confirmation" size={26} color="#0A1F44" />
          </View>
        </LinearGradient>

        {/* ===== Feature tiles (colorful) ===== */}
        <View style={styles.featuresRow}>
          <LinearGradient
            colors={[Colors.aqua, Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featureTile}
          >
            <MaterialCommunityIcons name="map-search" size={20} color="#08223E" />
            <Text style={styles.featureText}>1600+ facilities</Text>
          </LinearGradient>
          <LinearGradient
            colors={[Colors.purple, Colors.pink]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featureTile}
          >
            <MaterialCommunityIcons name="infinity" size={20} color="#1D0A2B" />
            <Text style={styles.featureText}>Unlimited visits</Text>
          </LinearGradient>
          <LinearGradient
            colors={[Colors.lemon, Colors.aqua]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featureTile}
          >
            <MaterialCommunityIcons name="account-multiple" size={20} color="#1A1A1A" />
            <Text style={styles.featureText}>Family add‑ons</Text>
          </LinearGradient>
        </View>

        {/* ===== How it works ===== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <Pressable>
            <Text style={styles.linkText}>Learn more</Text>
          </Pressable>
        </View>
        <View style={styles.stepsWrap}>
          {steps.map((s) => (
            <View key={s.id} style={styles.stepCard}>
              <View style={styles.stepIconWrap}>
                <MaterialCommunityIcons name={s.icon as any} size={18} color={Colors.primary} />
              </View>
              <Text style={styles.stepTitle}>{s.title}</Text>
              <Text style={styles.stepCopy}>{s.copy}</Text>
            </View>
          ))}
        </View>

        {/* ===== Facilities carousel (colorful cards) ===== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Close to you</Text>
          <Pressable>
            <Text style={styles.linkText}>See all</Text>
          </Pressable>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={facilities}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item, index }) => (
            <LinearGradient
              colors={index % 2 === 0 ? [Colors.cardAlt, "#FFFFFF"] : ["#F9ECFF", "#FFFFFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.facilityCard}
            >
              <View style={styles.facilityIcon}>
                <MaterialCommunityIcons name={item.icon as any} size={22} color={Colors.navy} />
              </View>
              <Text style={styles.facilityName}>{item.name}</Text>
              <Text style={styles.facilityMeta}>
                {item.distance} · {item.tag}
              </Text>
              <View style={styles.facilityCTA}>
                <Text style={styles.facilityCTAText}>Navigate</Text>
                <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.primary} />
              </View>
            </LinearGradient>
          )}
        />

        {/* ===== Plans (gradient border cards) ===== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Plans</Text>
          <Pressable>
            <Text style={styles.linkText}>Compare</Text>
          </Pressable>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={plans}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item }) => (
            <LinearGradient
              colors={item.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.planBorder}
            >
              <View style={styles.planCard}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.planName}>{item.name}</Text>
                  <Text style={styles.planPrice}>{item.price}</Text>
                </View>
                {item.features.map((f, idx) => (
                  <View key={idx} style={styles.planRow}>
                    <MaterialCommunityIcons name="check-circle" size={16} color={Colors.primary} />
                    <Text style={styles.planFeature}>{f}</Text>
                  </View>
                ))}
                <Pressable style={styles.planBtn}>
                  <Text style={styles.planBtnText}>Choose {item.name}</Text>
                </Pressable>
              </View>
            </LinearGradient>
          )}
        />

        {/* ===== Testimonial ===== */}
        <View style={[styles.card, { marginTop: 20 }]}>
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <Image
              source={{ uri: "https://i.pravatar.cc/60?img=12" }}
              style={{ width: 44, height: 44, borderRadius: 22 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.testimonialQuote}>
                “Now my husband has no excuse not to try the gym — it’s all included!”
              </Text>
              <Text style={styles.testimonialMeta}>Maryan · NSW Health</Text>
            </View>
          </View>
        </View>

        {/* ===== Promo banner ===== */}
        <Pressable style={{ borderRadius: 18, overflow: "hidden", marginTop: 16 }}>
          <LinearGradient
            colors={[Colors.pink, Colors.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.promo}
          >
            <View>
              <Text style={styles.promoTitle}>Spring challenge</Text>
              <Text style={styles.promoCopy}>Join 4 sessions/wk and unlock rewards.</Text>
            </View>
            <MaterialCommunityIcons name="arrow-right" size={22} color="#1D0A2B" />
          </LinearGradient>
        </Pressable>

        <View style={{ height: 36 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 18 },

  // Header
  header: {
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.card,
    borderBottomColor: Colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: { color: Colors.ink, fontWeight: "900", fontSize: 18, letterSpacing: 0.2 },
  headerLink: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#EEF4FF",
  },
  headerLinkText: { color: Colors.primary, fontWeight: "700" },

  // Hero
  hero: {
    margin: 16,
    borderRadius: 24,
    padding: 18,
    minHeight: 186,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 12px 24px rgba(11, 43, 102, 0.2)",
    elevation: 8,
  },
  heroEyebrow: {
    color: "#EAF2FF",
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.95,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  heroTitle: { color: "white", fontSize: 24, fontWeight: "900", lineHeight: 30 },
  heroPillsRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  heroBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D9F7FB",
    alignItems: "center",
    justifyContent: "center",
  },

  // Search
  searchRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  searchInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F0F4FF",
    borderColor: "#D6E0FF",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, color: "#0F172A" },
  searchBtn: {
    backgroundColor: Colors.lemon,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnText: { color: "#111827", fontWeight: "900" },

  // Pills
  pill: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  pillText: { color: Colors.primary, fontWeight: "800", fontSize: 12 },

  // Feature tiles
  featuresRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginTop: 2 },
  featureTile: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  featureText: { color: "#0B1220", fontWeight: "800" },

  // Section
  sectionHeader: {
    marginTop: 16,
    marginBottom: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: Colors.ink },
  linkText: { color: Colors.primary, fontWeight: "800" },

  // Facilities
  facilityCard: {
    width: 240,
    borderRadius: 18,
    padding: 14,
    boxShadow: "0 8px 16px rgba(28, 43, 77, 0.06)",
    elevation: 2,
  },
  facilityIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#D9F7FB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  facilityName: { fontSize: 14, fontWeight: "900", color: Colors.ink },
  facilityMeta: { color: Colors.muted, marginTop: 2 },
  facilityCTA: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 4 },
  facilityCTAText: { color: Colors.primary, fontWeight: "900" },

  // Plans
  planBorder: { width: 260, borderRadius: 20, padding: 1 },
  planCard: { backgroundColor: Colors.card, borderRadius: 19, padding: 14 },
  planName: { fontSize: 16, fontWeight: "900", color: Colors.ink },
  planPrice: { fontSize: 14, fontWeight: "900", color: Colors.primary },
  planRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  planFeature: { color: Colors.slate, fontWeight: "600" },
  planBtn: {
    marginTop: 10,
    backgroundColor: "#EEF4FF",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  planBtnText: { color: Colors.primary, fontWeight: "900" },

  // Generic card
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 16,
    boxShadow: "0 8px 16px rgba(28, 43, 77, 0.06)",
    elevation: 2,
  },

  // Steps
  stepsWrap: { flexDirection: "row", gap: 10, paddingHorizontal: 16 },
  stepCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  stepTitle: { color: Colors.ink, fontWeight: "900" },
  stepCopy: { color: Colors.muted, marginTop: 2 },

  // Testimonial
  testimonialQuote: { color: Colors.ink, fontStyle: "italic" },
  testimonialMeta: { color: Colors.muted, fontSize: 12, marginTop: 2 },

  // Promo
  promo: {
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
