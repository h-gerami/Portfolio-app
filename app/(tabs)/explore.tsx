import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Image,
  Animated,
  TouchableOpacity,
  Text,
  Modal,
  Easing,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import imageReact from "../../assets/images/react-logo.png";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

/* =========================
 * Data
 * =======================*/
const skills = [
  { name: "React Native", icon: "mobile" },
  { name: "React", icon: "react-image" as const }, // custom (image)
  { name: "Ionic", icon: "tablet" },
  { name: "TypeScript", icon: "code" },
  { name: "JavaScript", icon: "code" },
  { name: "Redux", icon: "exchange" },
  { name: "Node.js", icon: "server" },
  { name: "GraphQL", icon: "database" },
  { name: "REST API", icon: "plug" },
  { name: "Bluetooth LE", icon: "bluetooth" },
  { name: "Wi-Fi", icon: "wifi" },
  { name: "IoT", icon: "microchip" },
  { name: "AWS", icon: "cloud" },
  { name: "Azure", icon: "cloud" },
  { name: "Jira", icon: "tasks" },
  { name: "Git", icon: "git" },
  { name: "CI/CD", icon: "cogs" },
  { name: "UI/UX", icon: "paint-brush" },
  { name: "Mobile Perf", icon: "tachometer" },
] as const;

type Difficulty = "easy" | "medium" | "hard";
const difficultyPresets: Record<Difficulty, { time: number; label: string }> = {
  easy: { time: 30, label: "😌 Easy" },
  medium: { time: 20, label: "😏 Medium" },
  hard: { time: 12, label: "💀 Hard" },
};

/* =========================
 * Constants (layout / perf)
 * =======================*/
const COLS = 2;
const GAP = 10;
const PADDING_H = 16;
const CARD_W = (SCREEN_W - PADDING_H * 2 - GAP) / COLS;
const CARD_H = 120;

/* =========================
 * Helpers
 * =======================*/
function randomInt(maxExcl: number, butNot?: number) {
  if (maxExcl <= 1) return 0;
  let idx = Math.floor(Math.random() * maxExcl);
  if (butNot == null) return idx;
  while (idx === butNot) idx = Math.floor(Math.random() * maxExcl);
  return idx;
}

/* =========================
 * Confetti (no deps)
 * =======================*/
function useConfetti() {
  const [show, setShow] = useState(false);
  const pieces = useMemo(() => Array.from({ length: 14 }, (_, i) => i), []);
  const anims = useRef(pieces.map(() => new Animated.Value(0))).current;

  const start = useCallback(() => {
    setShow(true);
    Animated.stagger(
      60,
      anims.map((v) =>
        Animated.timing(v, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ),
    ).start(() => {
      anims.forEach((v) => v.setValue(0));
      setShow(false);
    });
  }, [anims]);

  const Render = useCallback(() => {
    if (!show) return null;
    return (
      <View pointerEvents="none" style={styles.confettiWrap}>
        {anims.map((v, i) => {
          const tx = v.interpolate({
            inputRange: [0, 1],
            outputRange: [0, (Math.random() * 2 - 1) * 120],
          });
          const ty = v.interpolate({
            inputRange: [0, 1],
            outputRange: [0, SCREEN_H * 0.35 + Math.random() * 120],
          });
          const rot = v.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", `${Math.random() * 720 - 360}deg`],
          });
          const size = 6 + Math.random() * 10;
          const bg = ["#60a5fa", "#34d399", "#fbbf24", "#f472b6", "#a78bfa"][
            i % 5
          ];
          return (
            <Animated.View
              key={i}
              style={[
                styles.confettiPiece,
                {
                  width: size,
                  height: size,
                  backgroundColor: bg,
                  transform: [
                    { translateX: tx },
                    { translateY: ty },
                    { rotate: rot },
                  ],
                },
              ]}
            />
          );
        })}
      </View>
    );
  }, [show, anims]);

  return { start, Confetti: Render };
}

/* =========================
 * Skill Card (memoized)
 * =======================*/
type SkillItem = (typeof skills)[number];
type SkillCardProps = {
  item: SkillItem;
  index: number;
  active: boolean; // pulsing focus
  reveal: boolean; // show which was target at end
  isTarget: boolean;
  onLongPress: (i: number) => void;
};
const SkillCard = React.memo(function SkillCard({
  item,
  index,
  active,
  reveal,
  isTarget,
  onLongPress,
}: SkillCardProps) {
  // Animations
  const pulse = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }
    pulse.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 600,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, pulse]);

  const scale = pressScale.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.97],
  });
  const ringScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });
  const ringOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.12, 0.28],
  });

  const onPressIn = () =>
    Animated.timing(pressScale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  const onPressOut = () =>
    Animated.timing(pressScale, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onLongPress={() => onLongPress(index)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.cardTouch}
    >
      <Animated.View
        style={[
          styles.skillCard,
          { transform: [{ scale }] },
          active && styles.cardActive,
          reveal && isTarget && styles.cardTarget,
        ]}
      >
        {/* Soft pulse ring */}
        {active && (
          <Animated.View
            style={[
              styles.pulseRing,
              { transform: [{ scale: ringScale }], opacity: ringOpacity },
            ]}
          />
        )}

        {/* Icon / logo */}
        <View style={styles.iconWrap}>
          {item.icon === "react-image" ? (
            <Image source={imageReact} style={{ width: 54, height: 54 }} />
          ) : (
            <Icon
              name={item.icon as any}
              size={46}
              color={reveal && isTarget ? "#16a34a" : "#0f172a"}
            />
          )}
        </View>

        <Text style={styles.skillName} numberOfLines={1}>
          {item.name}
        </Text>

        {reveal && isTarget && (
          <View style={styles.targetBadge}>
            <Icon name="trophy" size={12} color="#fff" />
            <Text style={styles.targetBadgeText}>Target</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
});

/* =========================
 * Main Screen
 * =======================*/
export default function SkillHuntScreen() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [timeLeft, setTimeLeft] = useState(difficultyPresets[difficulty].time);
  const [running, setRunning] = useState(false);
  const [targetIdx, setTargetIdx] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const listRef = useRef<FlatList<SkillItem>>(null);

  const { start: fireConfetti, Confetti } = useConfetti();

  const startGame = useCallback((d: Difficulty) => {
    setDifficulty(d);
    const t = difficultyPresets[d].time;
    setTimeLeft(t);
    setResult(null);
    setShowDiffModal(false);
    const target = randomInt(skills.length);
    const firstActive = randomInt(skills.length, target); // avoid target flashing as active first
    setTargetIdx(target);
    setActiveIdx(firstActive);
    setRunning(true);

    // Timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setResult("lose");
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const resetGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);
    setResult(null);
    setTargetIdx(null);
    setActiveIdx(null);
    setTimeLeft(difficultyPresets[difficulty].time);
    setShowScrollHint(false);
  }, [difficulty]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Progress bar animation
  const progress = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: timeLeft / difficultyPresets[difficulty].time,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.out(Easing.quad),
    }).start();
  }, [timeLeft, difficulty, progress]);

  // Viewability hint
  const onViewableItemsChanged = useRef(
    ({
      viewableItems,
    }: {
      viewableItems: Array<{ index?: number | null }>;
    }) => {
      if (!running || activeIdx == null) return;
      if (viewableItems.length === 0) return;
      const first = viewableItems[0].index ?? 0;
      const last = viewableItems[viewableItems.length - 1].index ?? 0;
      setShowScrollHint(activeIdx < first || activeIdx > last);
    },
  ).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 60 });

  // Core mechanic: long-press card
  const onLongPressCard = useCallback(
    (pressedIndex: number) => {
      if (!running || result) return;

      // Win?
      if (pressedIndex === targetIdx) {
        if (timerRef.current) clearInterval(timerRef.current);
        setResult("win");
        setRunning(false);
        fireConfetti();
        return;
      }

      // Wrong: move active marker to a new random card (not same)
      setActiveIdx((prev) => {
        const next = randomInt(skills.length, prev ?? undefined);
        return next;
      });
    },
    [running, result, targetIdx, fireConfetti],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: SkillItem; index: number }) => (
      <SkillCard
        item={item}
        index={index}
        active={index === activeIdx && running}
        reveal={!running && result != null}
        isTarget={index === targetIdx}
        onLongPress={onLongPressCard}
      />
    ),
    [activeIdx, running, result, targetIdx, onLongPressCard],
  );

  const keyExtractor = useCallback(
    (it: SkillItem, i: number) => `${it.name}-${i}`,
    [],
  );

  const getItemLayout = useCallback(
    (_: SkillItem[] | null | undefined, index: number) => {
      const row = Math.floor(index / COLS);
      const length = CARD_H + GAP;
      const offset = row * length + PADDING_H; // + top padding for content
      return { length, offset, index };
    },
    [],
  );

  /* =========================
   * UI
   * =======================*/
  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View style={styles.brandDot} />
        <Text style={styles.title}>Skill Hunt</Text>
      </View>

      <TouchableOpacity
        onPress={() => setShowDiffModal(true)}
        style={styles.diffBtn}
        activeOpacity={0.85}
      >
        <Icon name="sliders" size={12} color="#0f172a" />
        <Text style={styles.diffBtnText}>
          {difficultyPresets[difficulty].label}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const hud = (
    <View style={styles.hud}>
      <View style={styles.timerWrap}>
        <Animated.View
          style={[
            styles.timerBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
      <View style={styles.hudRow}>
        <View style={styles.hudPill}>
          <Icon name="clock-o" size={12} color="#0f172a" />
          <Text style={styles.hudPillText}>{timeLeft}s</Text>
        </View>
        {running ? (
          <View
            style={[
              styles.hudPill,
              { backgroundColor: "#dcfce7", borderColor: "#86efac" },
            ]}
          >
            <Icon name="bolt" size={12} color="#166534" />
            <Text style={[styles.hudPillText, { color: "#166534" }]}>LIVE</Text>
          </View>
        ) : result === "win" ? (
          <View
            style={[
              styles.hudPill,
              { backgroundColor: "#fde68a", borderColor: "#f59e0b" },
            ]}
          >
            <Icon name="trophy" size={12} color="#92400e" />
            <Text style={[styles.hudPillText, { color: "#92400e" }]}>WIN</Text>
          </View>
        ) : result === "lose" ? (
          <View
            style={[
              styles.hudPill,
              { backgroundColor: "#fee2e2", borderColor: "#fecaca" },
            ]}
          >
            <Icon name="times" size={12} color="#991b1b" />
            <Text style={[styles.hudPillText, { color: "#991b1b" }]}>LOSE</Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  const footer = (
    <View style={styles.footer}>
      {showScrollHint && (
        <Text style={styles.hintText}>
          ⬆️⬇️ Scroll—active card is out of view
        </Text>
      )}

      {!running && !result && (
        <TouchableOpacity
          onPress={() => setShowDiffModal(true)}
          activeOpacity={0.9}
          style={styles.startCta}
        >
          <Icon name="play" size={14} color="#fff" />
          <Text style={styles.startCtaText}>Start</Text>
        </TouchableOpacity>
      )}

      {(result || running) && (
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={resetGame}
            activeOpacity={0.9}
            style={[styles.secondaryCta]}
          >
            <Icon name="refresh" size={12} color="#0f172a" />
            <Text style={styles.secondaryCtaText}>Reset</Text>
          </TouchableOpacity>

          {!running && (
            <TouchableOpacity
              onPress={() => setShowDiffModal(true)}
              activeOpacity={0.9}
              style={[styles.primaryCta]}
            >
              <Icon name="play" size={12} color="#fff" />
              <Text style={styles.primaryCtaText}>Play again</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  return (
    <ThemedView style={styles.screen}>
      {/* Decorative header background */}
      <View style={styles.heroBg}>
        <View
          style={[
            styles.blob,
            { top: -30, left: -40, backgroundColor: "#dbeafe" },
          ]}
        />
        <View
          style={[
            styles.blob,
            {
              top: 40,
              right: -30,
              backgroundColor: "#bfdbfe",
              width: 200,
              height: 200,
            },
          ]}
        />
      </View>

      {/* HUD */}
      {header}
      {hud}

      {/* Confetti overlay */}
      <Confetti />

      {/* Grid */}
      <FlatList
        ref={listRef}
        data={skills}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={COLS}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{
          paddingHorizontal: PADDING_H,
          paddingTop: 10,
          paddingBottom: 14,
        }}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        getItemLayout={getItemLayout}
        // perf
        initialNumToRender={8}
        maxToRenderPerBatch={16}
        updateCellsBatchingPeriod={16}
        windowSize={7}
        removeClippedSubviews
        ListFooterComponent={footer}
      />

      {/* Difficulty modal */}
      <Modal
        visible={showDiffModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDiffModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>🎯 Choose your challenge</Text>
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <TouchableOpacity
                key={d}
                style={styles.modalBtn}
                onPress={() => startGame(d)}
                activeOpacity={0.9}
              >
                <Text style={styles.modalBtnText}>
                  {difficultyPresets[d].label}
                </Text>
                <Text style={styles.modalBtnSub}>
                  {difficultyPresets[d].time}s
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowDiffModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

/* =========================
 * Styles
 * =======================*/
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#ffffff" },

  heroBg: {
    position: "absolute",
    height: 160,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "#EAF2FF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  blob: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 999,
    opacity: 0.55,
    transform: [{ rotate: "10deg" }],
  },

  header: {
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#2563eb",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  diffBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  diffBtnText: { color: "#0f172a", fontWeight: "700", fontSize: 12 },

  hud: {
    paddingHorizontal: 16,
  },
  timerWrap: {
    height: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  timerBar: {
    height: "100%",
    backgroundColor: "#2563eb",
  },
  hudRow: {
    marginTop: 8,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  hudPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f1f5f9",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  hudPillText: { color: "#0f172a", fontWeight: "700", fontSize: 12 },

  cardTouch: { width: CARD_W },
  skillCard: {
    height: CARD_H,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: GAP,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cardActive: {
    shadowColor: "#60a5fa",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  cardTarget: {
    borderColor: "#16a34a",
    backgroundColor: "#dcfce7",
  },
  pulseRing: {
    position: "absolute",
    width: CARD_W * 0.92,
    height: CARD_H * 0.9,
    borderRadius: 12,
    backgroundColor: "#60a5fa",
  },
  iconWrap: { marginBottom: 8 },
  skillName: { color: "#0f172a", fontWeight: "800" },

  targetBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#16a34a",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  targetBadgeText: { color: "#fff", fontWeight: "800", fontSize: 11 },

  footer: {
    paddingTop: 10,
    paddingBottom: 14,
    alignItems: "center",
  },
  startCta: {
    backgroundColor: "#111827",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  startCtaText: { color: "#fff", fontWeight: "800" },
  secondaryCta: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  secondaryCtaText: { color: "#0f172a", fontWeight: "800", fontSize: 12 },
  primaryCta: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  primaryCtaText: { color: "#fff", fontWeight: "800", fontSize: 12 },

  hintText: { color: "#64748b", fontSize: 12, marginBottom: 6 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBox: {
    width: SCREEN_W * 0.8,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  modalTitle: {
    color: "#0f172a",
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  modalBtn: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalBtnText: { color: "#0f172a", fontWeight: "800" },
  modalBtnSub: { color: "#64748b", fontWeight: "700" },
  modalCancel: {
    alignSelf: "center",
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalCancelText: { color: "#64748b", fontWeight: "800" },

  // Confetti
  confettiWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 80,
    height: SCREEN_H * 0.5,
    alignItems: "center",
    overflow: "hidden",
  },
  confettiPiece: {
    position: "absolute",
    top: 0,
    borderRadius: 2,
  },
});
