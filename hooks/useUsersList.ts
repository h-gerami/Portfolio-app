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
  const [bLoading, setBloading] = useState<boolean>(false);

  // const useBounce = (delay: number) => {
  const [bounceText, setBounceText] = useState("");
  useEffect(() => {
    setBloading(true);
    const timer = setTimeout(() => {
      setBounceText(searchText);
      setBloading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchText]);

  // return bounceText;
  // };

  const fetchUsers = useCallback(
    async (ac?: AbortController) => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(url, { signal: ac?.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // dummyjson returns { users: [...] }
        setUsers((data.users ?? data) as User[]);
      } catch (e: any) {
        if (e?.name !== "AbortError") setError("Failed to load users.");
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
    // const d = useBounce(1000);
    const t = bounceText.trim().toLowerCase();
    if (!t) return users;

    // ensure uniqueness (defensive if API ever repeats)
    const unique = Array.from(new Map(users.map((u) => [u.id, u])).values());
    const first = unique.filter((u) => u.firstName.toLowerCase().includes(t));
    const last = unique.filter(
      (u) => u.lastName.toLowerCase().includes(t) && !first.some((f) => f.id === u.id),
    );
    setBloading(false);
    return [...first, ...last];
  }, [users, bounceText]);

  const onRefresh = useCallback(() => {
    setUsers([]);
    fetchUsers();
  }, [fetchUsers]);

  const keyExtractor = useCallback((item: User) => String(item.id), []);

  const getItemLayout = useCallback(
    (_: User[] | null | undefined, index: number) => ({
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
    bLoading,

    // expose sizes for consumer if needed
    itemHeight,
    separatorHeight,
  };
};
