// screens/ElmoLmsScreen.light.tsx
import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Dimensions,
  ScrollView,
 Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import { useDarkTabBar } from "@/hooks/useDarkTabBar";

const { width: SCREEN_W } = Dimensions.get("window");

type Course = {
  id: string;
  title: string;
  category: string;
  durationMins: number;
  cpd?: number;
  image: string;
  compliance?: boolean;
  progress?: number; // 0..1
};

const HERO_SLIDES: {
  id: string;
  title: string;
  caption: string;
  image: string;
}[] = [
  {
    id: "s2",
    title: "Create courses fast",
    caption: "SCORM, surveys, docs & ILT in one place",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "s3",
    title: "Learn anywhere",
    caption: "Mobile-friendly learning with reminders",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "s1",
    title: "Compliance, simplified",
    caption: "Automated assignments, reminders & reporting",
    image:
      "https://images.unsplash.com/photo-1580983561371-7f3df2f0f5b0?q=80&w=1600&auto=format&fit=crop",
  },
];

const SUGGESTED: Course[] = [
  {
    id: "c1",
    title: "Workplace Health & Safety",
    category: "Compliance",
    durationMins: 45,
    cpd: 1,
    image:
      "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1600&auto=format&fit=crop",
    compliance: true,
    progress: 0.3,
  },
  {
    id: "c2",
    title: "Privacy & Data Security (SCORM)",
    category: "Compliance",
    durationMins: 35,
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1600&auto=format&fit=crop",
    compliance: true,
    progress: 0.8,
  },
  {
    id: "c3",
    title: "Inclusive Leadership",
    category: "Soft Skills",
    durationMins: 50,
    cpd: 2,
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1600&auto=format&fit=crop",
    progress: 0.1,
  },
  {
    id: "c4",
    title: "First Aid Refresher (ILT+eLearning)",
    category: "Compliance",
    durationMins: 60,
    image:
      "https://images.unsplash.com/photo-1516542076529-1ea3854896e1?q=80&w=1600&auto=format&fit=crop",
  },
];

const LIBRARY: Course[] = [
  {
    id: "l1",
    title: "Code of Conduct",
    category: "Compliance",
    durationMins: 25,
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop",
    compliance: true,
  },
  {
    id: "l2",
    title: "Cyber Awareness",
    category: "IT & Security",
    durationMins: 30,
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "l3",
    title: "Customer Service Foundations",
    category: "Soft Skills",
    durationMins: 40,
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "l4",
    title: "Manual Handling",
    category: "Compliance",
    durationMins: 35,
    image:
      "https://images.unsplash.com/photo-1515165562835-c3b8c8f7a9a0?q=80&w=1600&auto=format&fit=crop",
    compliance: true,
  },
  {
    id: "l5",
    title: "Project Management Basics",
    category: "Professional",
    durationMins: 55,
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop",
  },
];

// ---------- Helpers ----------
function StatusBarFill({ color }: { color: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: insets.top,
        backgroundColor: color,
        zIndex: 1,
      }}
    />
  );
}

// Image with graceful fallback
function ImageWithFallback({
  uri,
  style,
  overlayContent,
}: {
  uri?: string;
  style: any;
  overlayContent?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <View style={[style, { overflow: "hidden", backgroundColor: "#f1f5f9" }]}>
      {uri && !failed && (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFillObject as any}
          resizeMode="cover"
          onError={() => setFailed(true)}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      )}

      {(failed || !uri) && (
        <View style={[StyleSheet.absoluteFillObject, styles.fallbackBox]}>
          <View style={styles.fallbackCircle}>
            <Text style={styles.fallbackEmoji}>🎓</Text>
          </View>
          <Text style={styles.fallbackText}>Image unavailable</Text>
        </View>
      )}

      {loading && !failed && (
        <View style={[StyleSheet.absoluteFillObject, styles.loaderBox]}>
          <ActivityIndicator />
        </View>
      )}

      {overlayContent}
    </View>
  );
}

function Progress({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View style={styles.progressWrap}>
      <View style={[styles.progressFill, { width: `${pct}%` }]} />
    </View>
  );
}

function Pill({ text, accent }: { text: string; accent?: boolean }) {
  return (
    <View style={[styles.pill, accent && styles.pillAccent]}>
      <Text style={[styles.pillText, accent && styles.pillTextAccent]}>
        {text}
      </Text>
    </View>
  );
}

function CourseCard({ c }: { c: Course }) {
  return (
    <View style={styles.card}>
      <ImageWithFallback uri={c.image} style={styles.cardImg} />
      <View style={{ padding: 12, gap: 6 }}>
        <View
          style={{
            flexDirection: "row",
            gap: 6,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {c.compliance && <Pill text="Compliance" accent />}
          {typeof c.cpd === "number" && <Pill text={`${c.cpd} CPD`} />}
          <Pill text={`${c.durationMins} mins`} />
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {c.title}
        </Text>
        <Text style={styles.cardMeta}>{c.category}</Text>
        {typeof c.progress === "number" && (
          <View style={{ marginTop: 2 }}>
            <Progress value={c.progress} />
            <Text style={styles.cardMeta}>
              {Math.round(c.progress * 100)}% complete
            </Text>
          </View>
        )}
        <View style={styles.cardCtas}>
          <TouchableOpacity style={styles.ctaGhost}>
            <Text style={styles.ctaGhostText}>Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaPrimary}>
            <Text style={styles.ctaPrimaryText}>Start</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ---------- Screen ----------
export default function ElmoLmsScreenLight() {
  useDarkTabBar();
  const isFocused = useIsFocused();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const heroLine = useMemo(
    () => "Create courses, track compliance & CPD, and learn anywhere.",
    [],
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    [...SUGGESTED, ...LIBRARY].forEach((c) => set.add(c.category));
    return ["All", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const list = [...LIBRARY];
    return list.filter((c) => {
      const matchesQ =
        !q ||
        c.title.toLowerCase().includes(q.toLowerCase()) ||
        c.category.toLowerCase().includes(q.toLowerCase());
      const matchesCat = !cat || cat === "All" || c.category === cat;
      return matchesQ && matchesCat;
    });
  }, [q, cat]);

  const sliderRef = useRef<FlatList<(typeof HERO_SLIDES)[number]>>(null);
  const [idx, setIdx] = useState(0);

  return (
    <SafeAreaView style={styles.safe}>
      {isFocused && (
        <>
          <StatusBar style="dark" translucent />
          <StatusBarFill color="#ffffff" />
        </>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>LMS</Text>
        {/* <TouchableOpacity onPress={() => {}}>
            <Text style={styles.linkText}>Watch demo →</Text>
          </TouchableOpacity> */}
      </View>

      <ScrollView style={styles.container}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.h1}>Learning that moves your org</Text>
          <Text style={styles.h2}>{heroLine}</Text>

          {/* KPI tiles */}
          <View style={styles.kpiRow}>
            <View style={styles.kpi}>
              <Text style={styles.kpiTop}>Compliance</Text>
              <Text style={styles.kpiBig}>96%</Text>
              <Text style={styles.kpiSub}>on-time completion</Text>
            </View>
            <View style={styles.kpi}>
              <Text style={styles.kpiTop}>CPD</Text>
              <Text style={styles.kpiBig}>+1.8</Text>
              <Text style={styles.kpiSub}>avg. credits/quarter</Text>
            </View>
            <View style={styles.kpi}>
              <Text style={styles.kpiTop}>Library</Text>
              <Text style={styles.kpiBig}>400+</Text>
              <Text style={styles.kpiSub}>courses available</Text>
            </View>
          </View>

          {/* Search / filter */}
          <View style={styles.searchRow}>
            <TextInput
              placeholder="Search courses, categories..."
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={q}
              onChangeText={setQ}
            />
            <TouchableOpacity style={styles.searchBtn}>
              <Text style={styles.searchBtnText}>Search</Text>
            </TouchableOpacity>
          </View>

          {/* Category pills */}
          <FlatList
            data={categories}
            keyExtractor={(x) => x}
            renderItem={({ item }) => {
              const active = (cat ?? "All") === item;
              return (
                <TouchableOpacity
                  onPress={() => setCat(item)}
                  style={[styles.catPill, active && styles.catPillActive]}
                >
                  <Text
                    style={[
                      styles.catPillText,
                      active && styles.catPillTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          />

          {/* HERO SLIDER */}
          <FlatList
            ref={sliderRef}
            data={HERO_SLIDES}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <ImageWithFallback
                uri={item.image}
                style={styles.slideWrap}
                overlayContent={
                  <View style={styles.slideOverlay}>
                    <Text style={styles.slideTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.slideCaption} numberOfLines={2}>
                      {item.caption}
                    </Text>
                  </View>
                }
              />
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const i = Math.round(
                e.nativeEvent.contentOffset.x / (SCREEN_W - 32),
              );
              setIdx(i);
            }}
            style={{ marginTop: 12 }}
          />
          <View style={styles.dots}>
            {HERO_SLIDES.map((s, i) => (
              <View
                key={s.id}
                style={[styles.dot, i === idx && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        {/* Suggested (horizontal carousel) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suggested for you</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={SUGGESTED}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <View style={{ width: SCREEN_W * 0.82, marginRight: 14 }}>
              <CourseCard c={item} />
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          snapToAlignment="start"
          decelerationRate="fast"
          snapToInterval={SCREEN_W * 0.82 + 14}
        />

        {/* Library */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Text style={styles.sectionTitle}>Library</Text>
          <Text style={styles.resultsText}>
            Showing {filtered.length} of {LIBRARY.length}
          </Text>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => <CourseCard c={item} />}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        />

        {/* Bottom CTA */}
        <View style={styles.bottomCard}>
          <Text style={styles.bottomTitle}>
            Prove compliance, grow capability
          </Text>
          <Text style={styles.bottomCopy}>
            Auto-assign mandatory training, track CPD, and generate reports—on
            the go.
          </Text>
          <TouchableOpacity style={styles.ctaPrimaryFull}>
            <Text style={styles.ctaPrimaryText}>
              Explore reporting & certificates
            </Text>
          </TouchableOpacity>
        </View>

        {/* s */}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- Styles (Light Theme) ----------
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  container: { flex: 1, backgroundColor: "#ffffff" },

  header: {
    paddingTop: 6,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomColor: "#e5e7eb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    color: "#0f172a",
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 0.2,
  },
  linkText: { color: "#2563eb", fontWeight: "600" },

  hero: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: "#ffffff",
  },
  h1: { color: "#0f172a", fontSize: 22, fontWeight: "800", marginBottom: 6 },
  h2: { color: "#475569", fontSize: 14, lineHeight: 20, marginBottom: 10 },

  kpiRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  kpi: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  kpiTop: { color: "#64748b", fontSize: 12 },
  kpiBig: { color: "#0f172a", fontWeight: "800", fontSize: 18, marginTop: 2 },
  kpiSub: { color: "#64748b", fontSize: 11 },

  searchRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  input: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#0f172a",
  },
  searchBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    borderRadius: 10,
    justifyContent: "center",
  },
  searchBtnText: { color: "#ffffff", fontWeight: "700" },

  // Category pills
  catPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  catPillActive: { backgroundColor: "#111827", borderColor: "#111827" },
  catPillText: { color: "#334155", fontWeight: "700", fontSize: 12 },
  catPillTextActive: { color: "#ffffff" },

  // Hero slider
  slideWrap: {
    width: SCREEN_W - 32,
    height: 200,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    marginRight: 0,
  },
  slideOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  slideTitle: { color: "#0f172a", fontWeight: "800", fontSize: 16 },
  slideCaption: { color: "#475569", fontSize: 12, marginTop: 2 },

  dots: {
    flexDirection: "row",
    gap: 6,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  dotActive: { backgroundColor: "#111827", width: 18 },

  sectionHeader: {
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { color: "#0f172a", fontWeight: "800", fontSize: 16 },
  sectionLink: { color: "#2563eb", fontWeight: "600" },
  resultsText: { color: "#64748b", fontSize: 12 },

  // Cards
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  cardImg: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  cardTitle: { color: "#0f172a", fontWeight: "800", fontSize: 15 },
  cardMeta: { color: "#64748b", fontSize: 12 },

  pill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  pillAccent: {
    backgroundColor: "#dcfce7",
    borderColor: "#bbf7d0",
  },
  pillText: { color: "#334155", fontWeight: "700", fontSize: 11 },
  pillTextAccent: { color: "#166534" },

  progressWrap: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2563eb",
  },

  cardCtas: { flexDirection: "row", gap: 10, marginTop: 8 },
  ctaGhost: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  ctaGhostText: { color: "#0f172a", fontWeight: "700" },
  ctaPrimary: {
    flex: 1,
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  ctaPrimaryText: { color: "#ffffff", fontWeight: "800" },
  ctaPrimaryFull: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  bottomCard: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 14,
  },
  bottomTitle: {
    color: "#0f172a",
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 6,
  },
  bottomCopy: { color: "#475569" },

  // footnote: {
  //   textAlign: "center",
  //   color: "#64748b",
  //   fontSize: 12,
  //   marginTop: 14,
  // },

  // Fallback visuals
  fallbackBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  loaderBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackCircle: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  fallbackEmoji: { fontSize: 22 },
  fallbackText: { color: "#64748b", fontSize: 12 },
});
