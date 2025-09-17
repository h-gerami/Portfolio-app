import { useInput } from "@/hooks/useInput";
import { renderHook, act } from "@testing-library/react-native";

test("Are the atts defined correctly", () => {
  const { result, rerender } = renderHook((value: string) => useInput(value));
  expect(result.current.input).toBeDefined();
  expect(result.current.input).toBe("23");
  expect(typeof result.current.input).toBe("string");
  expect(result.current.setInput).toBeDefined();
  expect(typeof result.current.setInput).toBe("function");
  rerender("gfsdg");
  expect(result.current.input).toBe("gfsdg");
  // Test that setInput can be called
  act(() => {
    result.current.setInput("test");
  });
  expect(result.current.input).toBe("test");
});

// test("increments retryCount until max", () => {
//   const { result } = renderHook(() => useInput(2));

//   act(() => result.current.retry()); // first
//   expect(result.current.retryCount).toBe(1);
//   expect(result.current.canRetry).toBe(true);

//   act(() => result.current.retry()); // second
//   expect(result.current.retryCount).toBe(2);
//   expect(result.current.canRetry).toBe(false);
// });

// test("reset brings retryCount back to 0", () => {
//   const { result } = renderHook(() => useInput(2));

//   act(() => {
//     result.current.retry();
//     result.current.retry();
//     result.current.reset();
//   });

//   expect(result.current.retryCount).toBe(0);
//   expect(result.current.canRetry).toBe(true);
// });
