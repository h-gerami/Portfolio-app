import { useState, useEffect, useRef } from "react";

export function useDebouncedQuantity(
  initialQuantity: number,
  delay: number = 500,
  onDebouncedChange: (quantity: number) => void
) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onDebouncedChange(quantity);
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [quantity, delay, onDebouncedChange]);

  // Sync with external changes
  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  return {
    quantity,
    setQuantity,
  };
}

