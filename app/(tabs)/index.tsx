import { Image } from "expo-image";
import React, { useRef } from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import image001 from "@/assets/images/image001.jpg";
import { TabButton } from "@/components/TabButton";
import { PrjDetail } from "@/components/PrjDetail";
import { usePrjStore } from "../../src/store/usePrjStore";
import { PrjName, projects } from "@/data/projects";

export default function HomeScreen() {
  const { selectedProject, setSelectedByTitle } = usePrjStore();

  const openLink = (url: string) => Linking.openURL(url);
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#F3F6FB", dark: "#0B1220" }}
      headerImage={
        <View style={styles.heroBgWrap}>
          <LinearGradient
            colors={["#B3E5FC", "#E0F2FE", "#F8FAFC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBg}
          />
          {/* decorative orbs */}
          <View
            style={[
              styles.orb,
              { top: 30, left: -20, backgroundColor: "#DBEAFE" },
            ]}
          />
          <View
            style={[
              styles.orb,
              {
                top: 90,
                right: -10,
                backgroundColor: "#BFDBFE",
                width: 180,
                height: 180,
              },
            ]}
          />
          <Image
            source={require("@/assets/images/3392673.png")}
            style={styles.reactLogo}
            contentFit="contain"
          />
        </View>
      }
    >
      {/* ===== Hero / Identity ===== */}
      <ThemedView style={styles.headerRow}>
        <Image
          source={image001}
          style={styles.profileImage}
          contentFit="cover"
        />
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <ThemedText type="title" style={styles.nameText}>
              Hossein Gerami
            </ThemedText>
            <HelloWave />
          </View>
          <ThemedText style={styles.roleText}>
            Senior React Native & Frontend Engineer
          </ThemedText>
          <ThemedText style={styles.subtleText}>
            Crafting fast, reliable mobile & web experiences. Strong on
            integrations (Xero, MYOB, Microsoft Dynamics, HubSpot) and modern
            backend with Node & AWS.
          </ThemedText>

          {/* Key tech chips */}
          <View style={styles.chipsRow}>
            <Chip label="React Native" />
            <Chip label="React" />
            <Chip label="TypeScript" />
            <Chip label="Node.js" />
            <Chip label="AWS" />
            <Chip label="Integrations" />
          </View>
        </View>
      </ThemedView>

      {/* ===== Credibility / Stats ===== */}
      {/* <View style={styles.statsRow}>
        
      </View> */}
      <StatCard
        icon="rocket"
        title="Performance-first"
        subtitle="Smooth UX, low jank"
      />
      <StatCard
        icon="cogs"
        title="Integrations"
        subtitle="CRM & finance systems"
      />
      <StatCard
        icon="shield"
        title="Quality"
        subtitle="Testing & reliability"
      />

      {/* ===== Intro copy ===== */}
      <ThemedView style={styles.copyWrap}>
        <ThemedText style={styles.copyLead}>
          I build products end-to-end, but live for the frontend: crisp UI,
          robust state, and thoughtful offline UX.
        </ThemedText>
      </ThemedView>

      {/* ===== Project selector ===== */}
      <SectionTitle title="Selected work" />
      <FlatList
        data={projects}
        horizontal
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => {
          const { title } = item;
          return (
            <TabButton
              key={title}
              active={title === selectedProject.title}
              title={title}
              onSelectTabButton={(t: PrjName) => {
                setSelectedByTitle(t);
              }}
            />
          );
        }}
        contentContainerStyle={styles.tabsContainer}
        showsHorizontalScrollIndicator={false}
      />

      {/* ===== Project detail ===== */}
      <PrjDetail
        selectedProject={selectedProject}
        key={selectedProject.title}
      />

      {/* (dev) render count hidden by default; uncomment if needed */}
      {/* <ThemedText>{renderCount.current}</ThemedText> */}
      {/* ===== Contact (cards) ===== */}
      {/* <View style={styles.contactRow}> */}
      <ContactCard
        icon="phone"
        label="Call"
        value="+61 0435 827 842"
        onPress={() => openLink("tel:+61435827842")}
      />
      <ContactCard
        icon="envelope"
        label="Email"
        value="h.gerami100@gmail.com"
        onPress={() => openLink("mailto:h.gerami100@gmail.com")}
      />
      <ContactCard
        icon="linkedin"
        label="LinkedIn"
        value="hossein-gerami"
        onPress={() => openLink("https://www.linkedin.com/in/hossein-gerami/")}
      />
      {/* </View> */}
    </ParallaxScrollView>
  );
}

/* =========================
 * Small components
 * =======================*/
function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <ThemedText style={styles.chipText}>{label}</ThemedText>
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
    </View>
  );
}

function StatCard({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <ThemedView style={styles.statCard}>
      <View style={styles.statIconWrap}>
        <Icon name={icon as any} size={16} color="#0F172A" />
      </View>
      <ThemedText style={styles.statTitle}>{title}</ThemedText>
      <ThemedText style={styles.statSubtitle}>{subtitle}</ThemedText>
    </ThemedView>
  );
}

function ContactCard({
  icon,
  label,
  value,
  onPress,
}: {
  icon: string;
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.contactCard}
    >
      <View style={styles.contactIcon}>
        <Icon name={icon as any} size={14} color="#0F172A" />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.contactLabel}>{label}</ThemedText>
        <ThemedText style={styles.contactValue} numberOfLines={1}>
          {value}
        </ThemedText>
      </View>
      <Icon name="chevron-right" size={12} color="#64748B" />
    </TouchableOpacity>
  );
}

/* =========================
 * Styles
 * =======================*/
const styles = StyleSheet.create({
  /* Header / hero background */
  heroBgWrap: {
    height: 178 * 1.6,
    width: "100%",
    position: "relative",
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  orb: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 999,
    opacity: 0.6,
    transform: [{ rotate: "12deg" }],
  },
  reactLogo: {
    height: 178 * 1.2,
    width: 290 * 1.2,
    position: "absolute",
    bottom: -6,
    right: -10,
    opacity: 0.3,
  },

  /* Hero content */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    marginTop: 6,
    marginBottom: 8,
  },
  profileImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
    elevation: 3,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  roleText: {
    marginTop: 2,
    color: "#0F172A",
    fontWeight: "700",
  },
  subtleText: {
    marginTop: 4,
    color: "#475569",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  chipText: {
    color: "#3730A3",
    fontWeight: "700",
    fontSize: 12,
  },

  /* Stats row */
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
  },
  statIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statTitle: {
    color: "#0F172A",
    fontWeight: "800",
  },
  statSubtitle: {
    color: "#64748B",
    marginTop: 2,
    fontSize: 12,
  },

  /* Contact cards */
  contactRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
    marginBottom: 10,
  },
  contactCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  contactIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  contactLabel: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 12,
  },
  contactValue: {
    color: "#334155",
    marginTop: 2,
  },

  /* Copy */
  copyWrap: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    marginBottom: 8,
  },
  copyLead: {
    color: "#0F172A",
    fontWeight: "700",
    marginBottom: 6,
  },
  copySub: {
    color: "#475569",
  },

  /* Section title */
  sectionHeader: {
    marginTop: 4,
    marginBottom: 6,
  },
  sectionTitle: {
    color: "#0F172A",
    fontWeight: "800",
    fontSize: 16,
  },

  /* Tabs */
  tabsContainer: {
    paddingBottom: 4,
  },
});
