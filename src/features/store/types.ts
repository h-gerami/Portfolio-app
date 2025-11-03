export type PetType =
  | "dog"
  | "cat"
  | "reptile"
  | "bird"
  | "fish"
  | "hamster"
  | "rabbit"
  | "guinea-pig"
  | "ferret"
  | "turtle"
  | "hedgehog"
  | "chinchilla"
  | "all";

export type PetProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: "food" | "toys" | "accessories" | "health" | "treats";
  petType: PetType; // Which pet this product is for
  rating: number;
  reviewCount: number;
  brand: string;
  inStock: boolean;
  badges?: string[]; // e.g., "Auto-Delivery", "Best Seller", "New"
};

export type CategoryTab = {
  label: string;
  key: "all" | PetProduct["category"];
  icon: string;
};

export const CATEGORIES: CategoryTab[] = [
  { label: "All", key: "all", icon: "grid-outline" },
  { label: "Food", key: "food", icon: "restaurant-outline" },
  { label: "Toys", key: "toys", icon: "game-controller-outline" },
  { label: "Health", key: "health", icon: "heart-outline" },
  { label: "Accessories", key: "accessories", icon: "bag-outline" },
  { label: "Treats", key: "treats", icon: "star-outline" },
];

export type PetTypeTab = {
  label: string;
  key: PetType;
  icon: string;
  emoji: string;
};

export const PET_TYPES: PetTypeTab[] = [
  { label: "All Pets", key: "all", icon: "paw-outline", emoji: "🐾" },
  { label: "Dogs", key: "dog", icon: "md-paw", emoji: "🐕" },
  { label: "Cats", key: "cat", icon: "md-paw", emoji: "🐈" },
  { label: "Birds", key: "bird", icon: "bird-outline", emoji: "🐦" },
  { label: "Fish", key: "fish", icon: "water-outline", emoji: "🐠" },
  { label: "Reptiles", key: "reptile", icon: "bug-outline", emoji: "🦎" },
  { label: "Rabbits", key: "rabbit", icon: "md-paw", emoji: "🐰" },
  { label: "Hamsters", key: "hamster", icon: "md-paw", emoji: "🐹" },
  { label: "Guinea Pigs", key: "guinea-pig", icon: "md-paw", emoji: "🐹" },
  { label: "Ferrets", key: "ferret", icon: "md-paw", emoji: "🦡" },
  { label: "Turtles", key: "turtle", icon: "md-paw", emoji: "🐢" },
  { label: "Hedgehogs", key: "hedgehog", icon: "md-paw", emoji: "🦔" },
  { label: "Chinchillas", key: "chinchilla", icon: "md-paw", emoji: "🐭" },
];

