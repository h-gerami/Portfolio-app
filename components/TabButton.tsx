import React, { PropsWithChildren } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { PrjName } from "@/data/projects";

export const TabButton = ({
  title,
  active,
  onSelectTabButton,
}: PropsWithChildren & {
  title: PrjName;
  active: boolean;
  onSelectTabButton: (t: PrjName) => void;
}) => {
  return (
    <TouchableOpacity
      key={title}
      style={[styles.tabButton, active && styles.activeTabButton]}
      onPress={() => onSelectTabButton(title)}
    >
      <ThemedText style={[styles.tabText, active && styles.activeTabText]}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    backgroundColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: "#0057a3",
  },
  tabText: {
    color: "#000",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
