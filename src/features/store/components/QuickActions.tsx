import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";

type QuickAction = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string[];
  onPress?: () => void;
};

const actions: QuickAction[] = [
  {
    id: "vet",
    title: "Vet Advice",
    subtitle: "Expert tips & guidance",
    icon: "heart",
    gradient: ["#EF4444", "#DC2626"],
    onPress: () => console.log("Vet Advice"),
  },
  {
    id: "insurance",
    title: "Pet Insurance",
    subtitle: "Protect your pet",
    icon: "shield",
    gradient: ["#3B82F6", "#2563EB"],
    onPress: () => console.log("Insurance"),
  },
  {
    id: "health",
    title: "Health Tips",
    subtitle: "Wellness & care",
    icon: "activity",
    gradient: ["#10B981", "#059669"],
    onPress: () => console.log("Health Tips"),
  },
  {
    id: "blog",
    title: "Pet Blog",
    subtitle: "Latest articles",
    icon: "book-open",
    gradient: ["#8B5CF6", "#7C3AED"],
    onPress: () => console.log("Blog"),
  },
];

type QuickActionsProps = {
  onActionPress?: (actionId: string) => void;
};

export function QuickActions({ onActionPress }: QuickActionsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Services</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            activeOpacity={0.8}
            onPress={() => onActionPress?.(action.id)}
            style={styles.actionCard}
          >
            <LinearGradient
              colors={action.gradient}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.iconContainer}>
                <Icon name={action.icon as any} size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  actionCard: {
    width: 140,
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
});

