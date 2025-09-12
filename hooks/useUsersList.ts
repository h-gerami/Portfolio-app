// hooks/useUsersList.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";

export type User = {
  id: number;
  image: string;
  firstName: string;
  lastName: string;
};

type Options = {
  url?: string;
  itemHeight?: number;
  separatorHeight?: number;
};

const DEFAULT_URL = "https://dummyjson.com/users?limit=100";

export const useUsersList = (options: Options = {}) => {
  const {
    url = DEFAULT_URL,
    itemHeight = 88,
    separatorHeight = StyleSheet.hairlineWidth,
  } = options;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);

  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
      setIsSearching(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchUsers = useCallback(
    async (ac?: AbortController, isRetry = false) => {
      try {
        setLoading(true);
        if (!isRetry) setError("");
        const res = await fetch(url, { signal: ac?.signal });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        // dummyjson returns { users: [...] }
        setUsers((data.users ?? data) as User[]);
        setRetryCount(0); // Reset retry count on success
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          const errorMessage = e.message || "Failed to load users. Please check your connection.";
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    [url],
  );

  useEffect(() => {
    const ac = new AbortController();
    fetchUsers(ac);
    return () => ac.abort();
  }, [fetchUsers]);

  const data = useMemo(() => {
    const t = debouncedSearchText.trim().toLowerCase();
    if (!t) return users;

    // ensure uniqueness (defensive if API ever repeats)
    const unique = Array.from(new Map(users.map((u) => [u.id, u])).values());
    const first = unique.filter((u) => u.firstName.toLowerCase().includes(t));
    const last = unique.filter(
      (u) => u.lastName.toLowerCase().includes(t) && !first.some((f) => f.id === u.id),
    );
    return [...first, ...last];
  }, [users, debouncedSearchText]);

  const onRefresh = useCallback(() => {
    setUsers([]);
    setRetryCount(0);
    fetchUsers();
  }, [fetchUsers]);

  const onRetry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      fetchUsers(undefined, true);
    }
  }, [fetchUsers, retryCount]);

  const keyExtractor = useCallback((item: User) => String(item.id), []);

  const getItemLayout = useCallback(
    (_: ArrayLike<User> | null | undefined, index: number) => ({
      length: itemHeight + separatorHeight,
      offset: (itemHeight + separatorHeight) * index,
      index,
    }),
    [itemHeight, separatorHeight],
  );

  return {
    // state
    data,
    count: data.length,
    loading,
    error,

    // search
    searchText,
    setSearchText,

    // list helpers
    keyExtractor,
    getItemLayout,
    onRefresh,
    onRetry,
    isSearching,

    // retry state
    retryCount,
    canRetry: retryCount < 3,

    // expose sizes for consumer if needed
    itemHeight,
    separatorHeight,
  };
};
