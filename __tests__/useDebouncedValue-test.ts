import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { act, renderHook, waitFor } from "@testing-library/react-native";

jest.useFakeTimers();

// import { useDebouncedValue } from "./useDebouncedValue";

test("returns last value only after the delay", async () => {
  const { result, rerender } = renderHook(
    ({ value, delay }: { value: string; delay: number }) => useDebouncedValue({ value, delay }),
    {
      initialProps: { value: "hi", delay: 300 },
    },
  );

  // initial
  expect(result.current.debounced).toBe("");
  expect(result.current.isDebouncing).toBe(true);

  // user types quickly: "a" -> "al" -> "ali"
  rerender({ value: "a", delay: 500 });
  expect(result.current.debounced).toBe(""); // not updated immediately
  expect(result.current.isDebouncing).toBe(true);

  rerender({ value: "al", delay: 500 });
  rerender({ value: "ali", delay: 500 });

  // before 500ms, still old
  act(() => {
    jest.advanceTimersByTime(400);
  });
  expect(result.current.debounced).toBe(""); // still not updated

  // after full 500ms since last change
  act(() => {
    jest.advanceTimersByTime(100);
  });

  expect(result.current.debounced).toBe("ali");
  expect(result.current.isDebouncing).toBe(false);
});

test("clears pending timeout when value changes", () => {
  const { result, rerender } = renderHook(
    ({ value, delay }: { value: string; delay: number }) => useDebouncedValue({ value, delay }),
    {
      initialProps: { value: "hi", delay: 100 },
    },
  );

  // halfway, change again -> previous timer must be cancelled
  act(() => {
    jest.advanceTimersByTime(150);
  });
  rerender({ value: "hello", delay: 300 });

  // After another 150ms (total 300 from first), it should NOT have set "hey"
  act(() => {
    jest.advanceTimersByTime(150);
  });
  expect(result.current.debounced).toBe("hi"); // still old
  expect(result.current.isDebouncing).toBe(true);

  // After full 300ms from the *last* change, now update
  act(() => {
    jest.advanceTimersByTime(150);
  });
  expect(result.current.debounced).toBe("hello");
});

test("respects new delays and cleans up on unmount", () => {
  const { result, rerender, unmount } = renderHook(
    ({ value, delay }: { value: string; delay: number }) => useDebouncedValue({ value, delay }),
    { initialProps: { value: "x", delay: 200 } },
  );

  rerender({ value: "y", delay: 50 }); // shorter delay now
  act(() => {
    jest.advanceTimersByTime(49);
  });
  expect(result.current.debounced).toBe(""); // not yet

  act(() => {
    jest.advanceTimersByTime(1);
  });
  expect(result.current.debounced).toBe("y"); // updated at 50ms

  // unmount should clear timers without throwing
  unmount();
});
