import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import { ProductCard } from "./ProductCard";
import { CategoryTabs } from "./CategoryTabs";
import { PetTypeTabs } from "./PetTypeTabs";
import { HeroBanner } from "./HeroBanner";
import { QuickActions } from "./QuickActions";
import { ArticlesSection } from "./ArticlesSection";
import { Article } from "./ArticleCard";
import { PetProduct, CategoryTab, CATEGORIES, PET_TYPES } from "../types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useProducts, useCart } from "../hooks";
import { useCartStore } from "@/src/store/useCartStore";
import Toast from "react-native-toast-message";

export default function StoreScreen() {
  const colorScheme = useColorScheme();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPetType, setSelectedPetType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch products from API
  const { data: products = [], isLoading, error, refetch, isRefetching } = useProducts();
  
  // Don't auto-fetch cart to prevent clearing local state
  // Cart will be synced via mutations only

  // Filter products by category, pet type, and search
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Pet type filter
    if (selectedPetType !== "all") {
      filtered = filtered.filter(
        (p) => p.petType === selectedPetType
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category === selectedCategory
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [products, selectedCategory, selectedPetType, searchQuery]);

  const handleRefresh = async () => {
    await refetch();
  };

  const refreshing = isRefetching;

  const handleQuickAction = (actionId: string) => {
    Toast.show({
      type: "info",
      text1: "Coming Soon",
      text2: `${actionId} feature will be available soon`,
      position: "bottom",
    });
  };

  const handleArticlePress = (article: Article) => {
    Toast.show({
      type: "info",
      text1: article.title,
      text2: "Article details coming soon",
      position: "bottom",
    });
  };

  const renderProduct = ({ item }: { item: PetProduct }) => (
    <ProductCard product={item} />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search */}
      <LinearGradient
        colors={colorScheme === "dark" 
          ? ["#1F2937", "#111827"] 
          : ["#F8FAFC", "#FFFFFF"]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Pet Store</Text>
            <View style={styles.iconBadge}>
              <Icon name="shopping-bag" size={18} color="#FFFFFF" />
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Icon name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products, brands..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearButton}
                activeOpacity={0.6}
              >
                <Icon
                  name="x"
                  size={18}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Pet Type Tabs */}
      <PetTypeTabs
        petTypes={PET_TYPES}
        activeKey={selectedPetType}
        onSelect={setSelectedPetType}
      />

      {/* Category Tabs */}
      <CategoryTabs
        categories={CATEGORIES}
        activeKey={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>
            Failed to load products: {error.message}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content Scroll */}
      {isLoading && filteredProducts.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#111827" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Hero Banner */}
          <HeroBanner />

          {/* Quick Actions */}
          <QuickActions onActionPress={handleQuickAction} />

          {/* Articles Section */}
          <ArticlesSection
            onArticlePress={handleArticlePress}
            onViewAllPress={() => handleQuickAction("articles")}
          />

          {/* Products Section */}
          <View style={styles.productsSection}>
            <View style={styles.productsHeader}>
              <Text style={styles.productsSectionTitle}>
                {searchQuery || selectedCategory !== "all" || selectedPetType !== "all"
                  ? "Search Results"
                  : "Featured Products"}
              </Text>
              <Text style={styles.productsCount}>
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
              </Text>
            </View>

            {filteredProducts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="package" size={48} color="#D1D5DB" />
                <Text style={styles.emptyText}>
                  {searchQuery ? "No products found" : "No products available"}
                </Text>
                {searchQuery && (
                  <Text style={styles.emptySubtext}>
                    Try adjusting your search or filters
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.productsGrid}>
                {filteredProducts.map((product) => (
                  <View key={product.id} style={styles.productWrapper}>
                    <ProductCard product={product} />
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    gap: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  productsSection: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  productsSectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  productsCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  productWrapper: {
    width: "47%",
    marginBottom: 16,
  },
  bottomSpacing: {
    height: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9CA3AF",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#D1D5DB",
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: "#B91C1C",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

