import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Icon from "react-native-vector-icons/Feather";

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  category: "vet" | "insurance" | "health" | "care";
  author: string;
  readTime: number;
  image: string;
  date: string;
};

type ArticleCardProps = {
  article: Article;
  onPress?: (article: Article) => void;
};

export function ArticleCard({ article, onPress }: ArticleCardProps) {
  const categoryColors = {
    vet: "#EF4444",
    insurance: "#3B82F6",
    health: "#10B981",
    care: "#8B5CF6",
  };

  const categoryLabels = {
    vet: "Vet Advice",
    insurance: "Insurance",
    health: "Health",
    care: "Care Tips",
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(article)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: article.image }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: categoryColors[article.category] },
            ]}
          >
            <Text style={styles.categoryText}>
              {categoryLabels[article.category]}
            </Text>
          </View>
          <Text style={styles.readTime}>
            <Icon name="clock" size={12} color="#9CA3AF" /> {article.readTime} min
          </Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.excerpt} numberOfLines={2}>
          {article.excerpt}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.author}>{article.author}</Text>
          <Text style={styles.date}>{article.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: "#F3F4F6",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  readTime: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    lineHeight: 24,
  },
  excerpt: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  author: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  date: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});

