import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import Icon from "react-native-vector-icons/FontAwesome";
import IconFeather from "react-native-vector-icons/Feather";
import { PetProduct } from "../types";
import { useCartStore } from "@/src/store/useCartStore";

type ProductCardProps = {
  product: PetProduct;
  onPress?: (product: PetProduct) => void;
};

export function ProductCard({ product, onPress }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart, removeFromCart, updateQuantity, items } = useCartStore();
  
  const cartItem = items.find((item) => item.product.id === product.id);
  const inCart = !!cartItem;
  const currentQuantity = cartItem?.quantity || 0;
  
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.inStock && !inCart) {
      // Show quantity selector first time
      if (!showQuantitySelector) {
        setShowQuantitySelector(true);
      }
    }
  };

  const handleConfirmAdd = () => {
    if (product.inStock) {
      addToCart(product, quantity);
      setShowQuantitySelector(false);
      setQuantity(1);
    }
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

  // Determine category emoji for fallback
  const getCategoryEmoji = () => {
    switch (product.category) {
      case "food":
        return "🍖";
      case "toys":
        return "🎾";
      case "health":
        return "💊";
      case "accessories":
        return "🛍️";
      case "treats":
        return "🍖";
      default:
        return "🛍️";
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(product)}
      activeOpacity={0.85}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        {!imageError && product.image ? (
          <>
            {imageLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#9CA3AF" />
              </View>
            )}
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              contentFit="cover"
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              onLoad={() => setImageLoading(false)}
              transition={200}
              cachePolicy="memory-disk"
              placeholderContentFit="cover"
              recyclingKey={product.id}
              priority="normal"
            />
          </>
        ) : (
          <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackEmoji}>{getCategoryEmoji()}</Text>
            <Text style={styles.fallbackText}>No Image</Text>
          </View>
        )}
        
        {/* Discount Badge */}
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discountPercent}%</Text>
          </View>
        )}
        
        {/* Stock Badge */}
        {!product.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Brand */}
        <Text style={styles.brand}>{product.brand}</Text>

        {/* Product Name */}
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Icon name="star" size={12} color="#FFB800" />
          <Text style={styles.ratingText}>
            {product.rating.toFixed(1)} ({product.reviewCount.toLocaleString()})
          </Text>
        </View>

        {/* Badges */}
        {product.badges && product.badges.length > 0 && (
          <View style={styles.badgeContainer}>
            {product.badges.slice(0, 2).map((badge, idx) => (
              <View key={idx} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          {hasDiscount && (
            <Text style={styles.originalPrice}>${product.originalPrice!.toFixed(2)}</Text>
          )}
        </View>

        {/* Quantity Selector or Add to Cart Button */}
        {showQuantitySelector && !inCart ? (
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <IconFeather name="minus" size={16} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.min(10, quantity + 1))}
            >
              <IconFeather name="plus" size={16} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, !product.inStock && styles.addToCartButtonDisabled]}
              onPress={handleConfirmAdd}
              disabled={!product.inStock}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowQuantitySelector(false);
                setQuantity(1);
              }}
            >
              <IconFeather name="x" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        ) : inCart ? (
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => handleQuantityChange(currentQuantity - 1)}
            >
              <IconFeather name="minus" size={14} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{currentQuantity}</Text>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => handleQuantityChange(currentQuantity + 1)}
            >
              <IconFeather name="plus" size={14} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={handleRemove}
            >
              <IconFeather name="trash-2" size={14} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              !product.inStock && styles.addToCartButtonDisabled,
            ]}
            onPress={handleAddToCart}
            disabled={!product.inStock}
            activeOpacity={0.7}
          >
            <IconFeather name="shopping-cart" size={16} color="#FFFFFF" />
            <Text style={styles.addToCartText}>
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    minWidth: "47%",
    maxWidth: "47%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 180,
    position: "relative",
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    zIndex: 1,
  },
  fallbackContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
  },
  fallbackEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  fallbackText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  outOfStockText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  content: {
    padding: 12,
  },
  brand: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    lineHeight: 20,
    minHeight: 40,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "500",
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4F46E5",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  originalPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  addToCartButton: {
    marginTop: 12,
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  addToCartButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  addToCartButtonAdded: {
    backgroundColor: "#10B981",
  },
  addToCartText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  quantitySelector: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  quantityText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    minWidth: 30,
    textAlign: "center",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  cancelButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityControls: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 6,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    minWidth: 24,
    textAlign: "center",
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
});

