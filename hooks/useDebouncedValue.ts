import React, { useState, useEffect } from "react";

export const useDebouncedValue = ({ value, delay }: { value: string; delay: number }) => {
  const [debounced, setDebounced] = useState<string>("");
  const [isDebouncing, setIsDebouncing] = useState<boolean | null>(null);

  useEffect(() => {
    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setDebounced(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [delay, value]);

  return {
    debounced,
    isDebouncing,
  };
};
