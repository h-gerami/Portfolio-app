import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { ArticleCard, Article } from "./ArticleCard";
import { articles } from "../data/articles";

type ArticlesSectionProps = {
  onArticlePress?: (article: Article) => void;
  onViewAllPress?: () => void;
};

export function ArticlesSection({
  onArticlePress,
  onViewAllPress,
}: ArticlesSectionProps) {
  const featuredArticles = articles.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="book-open" size={24} color="#111827" />
          <Text style={styles.sectionTitle}>Latest Articles</Text>
        </View>
        <TouchableOpacity
          onPress={onViewAllPress}
          style={styles.viewAllButton}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Icon name="chevron-right" size={18} color="#3B82F6" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={featuredArticles}
        renderItem={({ item }) => (
          <ArticleCard article={item} onPress={onArticlePress} />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
});

