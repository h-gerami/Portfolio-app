import React from "react";
import ProductsScreen from "@/src/features/products/components/ProductScreen";

export default function ProductsRoute() {
  return <ProductsScreen />;
}

// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   RefreshControl,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ListRenderItemInfo,
//   SafeAreaView,
//   Animated,
//   Easing,
//   TextInput,
// } from 'react-native';

// type Product = {
//   id: number;
//   title: string;
//   description: string;
//   thumbnail?: string;
//   price: number;
//   category?: string;
//   images?: string[];
// };

// type PageResponse = {
//   products: Product[];
//   total: number;
//   skip: number;
//   limit: number;
// };

// const PAGE_SIZE = 20;

// type TabType = { label: string; key: string };

// // First tab = "All" → hits /products (largest dataset)
// const TABS: TabType[] = [
//   { label: 'All', key: 'all' },
//   { label: 'Smartphones', key: 'smartphones' },
//   { label: "Men's Shirts", key: 'mens-shirts' },
//   { label: "Women's Dresses", key: 'womens-dresses' },
//   { label: 'Groceries', key: 'groceries' },
// ];

// async function fetchCategoryPage(category: string, page: number): Promise<PageResponse> {
//   const skip = page * PAGE_SIZE;
//   const url =
//     category === 'all'
//       ? `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${skip}`
//       : `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${PAGE_SIZE}&skip=${skip}`;
//   const res = await fetch(url);
//   if (!res.ok) throw new Error(`HTTP ${res.status}`);
//   return res.json();
// }

// type CatState = {
//   items: Product[];
//   page: number;
//   total: number | null;
//   loadingInitial: boolean;
//   loadingMore: boolean;
//   refreshing: boolean;
//   error: string | null;
//   inFlight: boolean; // guard per category
// };

// function makeInitialCatState(): CatState {
//   return {
//     items: [],
//     page: 0,
//     total: null,
//     loadingInitial: true,
//     loadingMore: false,
//     refreshing: false,
//     error: null,
//     inFlight: false,
//   };
// }

// // -------------------- Main Screen --------------------
// export default function ProductsTabsScreen() {
//   const [activeKey, setActiveKey] = useState<string>(TABS[0].key);

//   // Cache state per category (prevents blink/flicker)
//   const [cats, setCats] = useState<Record<string, CatState>>(() =>
//     Object.fromEntries(TABS.map(t => [t.key, makeInitialCatState()]))
//   );
//   const active = cats[activeKey] ?? makeInitialCatState();

//   // Filters (global, apply to all tabs)
//   const [query, setQuery] = useState('');
//   const [minPrice, setMinPrice] = useState<string>(''); // keep as string for input UX
//   const [maxPrice, setMaxPrice] = useState<string>('');
//   const [sort, setSort] = useState<'priceAsc' | 'priceDesc' | 'titleAsc' | null>(null);

//   // thin top loading bar animation
//   const bar = useRef(new Animated.Value(0)).current;
//   const runBar = useCallback(() => {
//     bar.setValue(0);
//     Animated.timing(bar, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: false }).start();
//   }, [bar]);

//   const setCat = useCallback((key: string, patch: Partial<CatState>) => {
//     setCats(prev => ({ ...prev, [key]: { ...(prev[key] ?? makeInitialCatState()), ...patch } }));
//   }, []);

//   const hasNextPage = useMemo(() => {
//     if (active.total == null) return true;
//     return active.items.length < active.total;
//   }, [active.items.length, active.total]);

//   const ensureInitial = useCallback(async (key: string) => {
//     const s = cats[key] ?? makeInitialCatState();
//     if (s.inFlight) return;
//     setCat(key, { inFlight: true, loadingInitial: s.items.length === 0, error: null });
//     try {
//       if (s.items.length > 0) runBar();
//       const data = await fetchCategoryPage(key, 0);
//       setCat(key, {
//         items: data.products,
//         total: data.total,
//         page: 0,
//         loadingInitial: false,
//         inFlight: false,
//       });
//     } catch (e: any) {
//       setCat(key, { error: e?.message ?? 'Failed to load', loadingInitial: false, inFlight: false });
//     }
//   }, [cats, runBar, setCat]);

//   const loadMore = useCallback(async (key: string) => {
//     const s = cats[key] ?? makeInitialCatState();
//     if (s.inFlight || s.loadingMore) return;
//     if (s.total != null && s.items.length >= s.total) return;

//     setCat(key, { inFlight: true, loadingMore: true, error: null });
//     try {
//       const nextPage = s.page + 1;
//       const data = await fetchCategoryPage(key, nextPage);
//       const map = new Map<number, Product>();
//       for (const it of s.items) map.set(it.id, it);
//       for (const it of data.products) map.set(it.id, it);
//       setCat(key, {
//         items: Array.from(map.values()),
//         total: data.total,
//         page: nextPage,
//         loadingMore: false,
//         inFlight: false,
//       });
//     } catch (e: any) {
//       setCat(key, { error: e?.message ?? 'Failed to load more', loadingMore: false, inFlight: false });
//     }
//   }, [cats, setCat]);

//   const onRefresh = useCallback(async (key: string) => {
//     const s = cats[key] ?? makeInitialCatState();
//     if (s.inFlight) return;
//     setCat(key, { inFlight: true, refreshing: true, error: null });
//     try {
//       runBar();
//       const data = await fetchCategoryPage(key, 0);
//       setCat(key, {
//         items: data.products,
//         total: data.total,
//         page: 0,
//         refreshing: false,
//         inFlight: false,
//       });
//     } catch (e: any) {
//       setCat(key, { error: e?.message ?? 'Failed to refresh', refreshing: false, inFlight: false });
//     }
//   }, [cats, runBar, setCat]);

//   // initial load for default tab
//   useEffect(() => {
//     ensureInitial(activeKey); // 'all' first → largest list
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // when switching tabs: keep old list visible, just fetch if needed
//   useEffect(() => {
//     const s = cats[activeKey];
//     if (!s || s.items.length === 0) {
//       ensureInitial(activeKey);
//     }
//   }, [activeKey, cats, ensureInitial]);

//   // ----- Filtering & Sorting (client-side, applies to current tab data) -----
//   const filteredItems = useMemo(() => {
//     let arr = active.items;

//     // text filter: title/description/category
//     if (query.trim()) {
//       const q = query.toLowerCase();
//       arr = arr.filter(p =>
//         (p.title ?? '').toLowerCase().includes(q) ||
//         (p.description ?? '').toLowerCase().includes(q) ||
//         (p.category ?? '').toLowerCase().includes(q)
//       );
//     }

//     // price range
//     const min = Number(minPrice);
//     const max = Number(maxPrice);
//     if (!Number.isNaN(min)) {
//       arr = arr.filter(p => p.price >= min);
//     }
//     if (!Number.isNaN(max) && max > 0) {
//       arr = arr.filter(p => p.price <= max);
//     }

//     // sorting
//     if (sort === 'priceAsc') {
//       arr = [...arr].sort((a, b) => a.price - b.price);
//     } else if (sort === 'priceDesc') {
//       arr = [...arr].sort((a, b) => b.price - a.price);
//     } else if (sort === 'titleAsc') {
//       arr = [...arr].sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
//     }

//     return arr;
//   }, [active.items, query, minPrice, maxPrice, sort]);

//   const keyExtractor = useCallback((it: Product) => String(it.id), []);

//   const renderItem = useCallback(({ item }: ListRenderItemInfo<Product>) => {
//     const img = item.thumbnail ?? item.images?.[0];
//     return (
//       <View style={styles.row}>
//         <Image source={{ uri: img }} style={styles.thumb} />
//         <View style={{ flex: 1 }}>
//           <Text style={styles.title}>{item.title}</Text>
//           <Text numberOfLines={2} style={styles.desc}>{item.description}</Text>
//           <Text style={styles.price}>${item.price.toFixed(2)}</Text>
//         </View>
//       </View>
//     );
//   }, []);

//   const ListFooter = useCallback(() => {
//     if (!active.loadingMore) {
//       if (!hasNextPage && active.items.length > 0) {
//         return (
//           <View style={[styles.center, { paddingVertical: 16 }]}>
//             <Text style={{ color: '#6b7280' }}>You’re all caught up 🎉</Text>
//           </View>
//         );
//       }
//       return null;
//     }
//     return (
//       <View style={[styles.center, { paddingVertical: 16 }]}>
//         <ActivityIndicator />
//       </View>
//     );
//   }, [active.items.length, active.loadingMore, hasNextPage]);

//   const tabsKeyExtractor = useCallback((tab: TabType) => tab.key, []);

//   // Animated top progress width
//   const barWidth = bar.interpolate({ inputRange: [0, 1], outputRange: ['0%', '120%'] });

//   const renderItemTabs = useCallback(({ item }: ListRenderItemInfo<TabType>) => {
//     const isActive = activeKey === item.key;
//     return (
//       <TouchableOpacity
//         onPress={() => setActiveKey(item.key)}
//         style={[styles.tabBtn, isActive && styles.tabActive]}>
//         <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{item.label}</Text>
//       </TouchableOpacity>
//     );
//   }, [activeKey]);

//   const clearFilters = () => {
//     setQuery('');
//     setMinPrice('');
//     setMaxPrice('');
//     setSort(null);
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       {/* Header / Tabs */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Popular Products</Text>

//         {/* Subtle top loading bar (no page blink) */}
//         {(active.inFlight || active.refreshing) && (
//           <Animated.View style={[styles.loadingBar, { width: barWidth }]} />
//         )}

//         {/* Filters (Homer-style look, but functional) */}
//         <View style={styles.filterBar}>
//           <TextInput
//             placeholder="Search title, description, category…"
//             placeholderTextColor="#6b7280"
//             style={styles.filterInput}
//             value={query}
//             onChangeText={setQuery}
//           />
//           <View style={styles.priceRow}>
//             <TextInput
//               placeholder="Min $"
//               placeholderTextColor="#9ca3af"
//               keyboardType="numeric"
//               value={minPrice}
//               onChangeText={setMinPrice}
//               style={styles.priceInput}
//             />
//             <Text style={styles.toText}>to</Text>
//             <TextInput
//               placeholder="Max $"
//               placeholderTextColor="#9ca3af"
//               keyboardType="numeric"
//               value={maxPrice}
//               onChangeText={setMaxPrice}
//               style={styles.priceInput}
//             />
//           </View>

//           <View style={styles.sortRow}>
//             <TouchableOpacity
//               onPress={() => setSort(sort === 'priceAsc' ? null : 'priceAsc')}
//               style={[styles.sortBtn, sort === 'priceAsc' && styles.sortBtnActive]}>
//               <Text style={[styles.sortText, sort === 'priceAsc' && styles.sortTextActive]}>Price ↑</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => setSort(sort === 'priceDesc' ? null : 'priceDesc')}
//               style={[styles.sortBtn, sort === 'priceDesc' && styles.sortBtnActive]}>
//               <Text style={[styles.sortText, sort === 'priceDesc' && styles.sortTextActive]}>Price ↓</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => setSort(sort === 'titleAsc' ? null : 'titleAsc')}
//               style={[styles.sortBtn, sort === 'titleAsc' && styles.sortBtnActive]}>
//               <Text style={[styles.sortText, sort === 'titleAsc' && styles.sortTextActive]}>Title A–Z</Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={clearFilters} style={styles.clearBtn}>
//               <Text style={styles.clearText}>Clear</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Tabs row (horizontal) */}
//         <View style={styles.tabs}>
//           <FlatList
//             data={TABS}
//             keyExtractor={tabsKeyExtractor}
//             renderItem={renderItemTabs}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//           />
//         </View>
//       </View>

//       {/* Error banner (tab specific) */}
//       {active.error ? (
//         <View style={styles.errorBanner}>
//           <Text style={styles.errorText}>Error: {active.error}</Text>
//           <TouchableOpacity onPress={() => ensureInitial(activeKey)} style={[styles.button, { marginTop: 8 }]}>
//             <Text style={styles.buttonText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       ) : null}

//       {/* Content */}
//       {active.loadingInitial && active.items.length === 0 ? (
//         <View style={[styles.center, { flex: 1 }]}>
//           <ActivityIndicator size="large" />
//           <Text style={{ marginTop: 8 }}>Loading…</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredItems}
//           keyExtractor={keyExtractor}
//           renderItem={renderItem}
//           ListFooterComponent={ListFooter}
//           refreshControl={<RefreshControl refreshing={active.refreshing} onRefresh={() => onRefresh(activeKey)} />}
//           onEndReached={() => loadMore(activeKey)}
//           onEndReachedThreshold={0.5}
//           // perf tuning
//           initialNumToRender={10}
//           maxToRenderPerBatch={16}
//           updateCellsBatchingPeriod={16}
//           windowSize={7}
//           removeClippedSubviews
//           contentContainerStyle={{ paddingBottom: 12 }}
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// // -------------------- Styles --------------------
// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: '#f8fafc' }, // softer page bg

//   header: {
//     backgroundColor: 'white',
//     paddingTop: 40,
//     paddingBottom: 10,
//     borderBottomColor: '#e5e7eb',
//     borderBottomWidth: StyleSheet.hairlineWidth,
//   },
//   headerTitle: {
//     fontWeight: '800',
//     fontSize: 18,
//     paddingHorizontal: 16,
//     color: '#0f172a',
//     paddingBottom: 6,
//   },

//   loadingBar: {
//     height: 3,
//     backgroundColor: '#111827',
//     marginHorizontal: 16,
//     borderRadius: 3,
//     marginBottom: 8,
//   },

//   // Filter bar (Homer-style look)
//   filterBar: {
//     paddingHorizontal: 12,
//     paddingBottom: 8,
//     gap: 8,
//   },
//   filterInput: {
//     backgroundColor: '#f1f5f9',
//     borderColor: '#e2e8f0',
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     color: '#0f172a',
//   },
//   priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   priceInput: {
//     flex: 1,
//     backgroundColor: '#f8fafc',
//     borderColor: '#e5e7eb',
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     color: '#0f172a',
//   },
//   toText: { color: '#64748b', fontWeight: '600' },

//   sortRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 2 },
//   sortBtn: {
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 999,
//     backgroundColor: '#f1f5f9',
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },
//   sortBtnActive: { backgroundColor: '#111827', borderColor: '#111827' },
//   sortText: { color: '#334155', fontWeight: '700', fontSize: 12 },
//   sortTextActive: { color: 'white' },

//   clearBtn: {
//     marginLeft: 'auto',
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 999,
//     backgroundColor: '#fee2e2',
//     borderWidth: 1,
//     borderColor: '#fecaca',
//   },
//   clearText: { color: '#991b1b', fontWeight: '700', fontSize: 12 },

//   tabs: {
//     flexDirection: 'row',
//     gap: 8,
//     paddingHorizontal: 12,
//     paddingTop: 2,
//     paddingBottom: 6,
//   },
//   tabBtn: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 999,
//     backgroundColor: '#f1f5f9',
//   },
//   tabActive: {
//     backgroundColor: '#111827',
//   },
//   tabText: {
//     fontWeight: '700',
//     color: '#334155',
//     fontSize: 13,
//   },
//   tabTextActive: {
//     color: 'white',
//   },

//   row: {
//     flexDirection: 'row',
//     padding: 12,
//     gap: 12,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: '#e5e7eb',
//     backgroundColor: 'white',
//   },
//   thumb: {
//     width: 64,
//     height: 64,
//     borderRadius: 8,
//     backgroundColor: '#f3f4f6',
//   },
//   title: { fontWeight: '600', fontSize: 16, marginBottom: 4, color: '#0f172a' },
//   desc: { color: '#6b7280', fontSize: 13, marginBottom: 6 },
//   price: { fontWeight: '600', color: '#0f172a' },

//   center: { alignItems: 'center', justifyContent: 'center', padding: 24 },
//   button: {
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 8,
//     backgroundColor: '#111827',
//   },
//   buttonText: { color: 'white', fontWeight: '700' },
//   errorBanner: {
//     padding: 12,
//     backgroundColor: '#fee2e2',
//     borderBottomColor: '#fecaca',
//     borderBottomWidth: StyleSheet.hairlineWidth,
//   },
//   errorText: { color: '#b91c1c', fontWeight: '700' },
// });
