import React, { PropsWithChildren } from "react";
import {
  FlatList,
  ImageStyle,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import Icon from "react-native-vector-icons/FontAwesome";
import { Image } from "expo-image";
import { Prj, PrjName } from "@/data/projects";

type PrjDetailProps = {
  selectedProject: Prj & { title: PrjName };
};

export const PrjDetail = ({ selectedProject }: PrjDetailProps) => {
  return (
    <ThemedView style={styles.projectCard}>
      <ThemedText type="subtitle">{selectedProject.title}</ThemedText>
      <ThemedText>{selectedProject.description}</ThemedText>

      <FlatList
        data={selectedProject.images}
        horizontal
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item: img }) => (
          <Image
            contentFit="contain"
            source={img}
            style={styles.projectImage}
          />
        )}
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 8 }}
      />

      <FlatList
        scrollEnabled={false}
        data={selectedProject.achievements}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          return (
            <ThemedView style={styles.achievementItem}>
              <ThemedView style={{ paddingTop: 5 }}>
                <Icon name="check-circle" size={14} color="#3899ec" />
              </ThemedView>
              <ThemedView>
                <ThemedText>{item}</ThemedText>
              </ThemedView>
            </ThemedView>
          );
        }}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  projectCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.03)",
    gap: 6,
  },
  projectImage: {
    width: 290,
    height: 290,
    borderRadius: 6,
    marginRight: 6,
  },
  achievementItem: {
    flexDirection: "row",
    // alignItems: 'center',
    gap: 5,
    // justifyContent:'flex-start',
    paddingLeft: 10,
    paddingRight: 30,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 5,
    // backgroundColor:'black'
  },
});
