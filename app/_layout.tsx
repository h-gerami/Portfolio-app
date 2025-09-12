import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { AppState, Platform } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import * as Sentry from "@sentry/react-native";

// ── React Query
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";

// single client instance (outside component)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30s
      gcTime: 5 * 60_000, // 5m
      retry: 1,
      refetchOnReconnect: true,
      // On native, there's no "window focus", so keep it off by default
      refetchOnWindowFocus: Platform.OS === "web",
    },
  },
});

// keep react-query aware of foreground/background
AppState.addEventListener("change", (state) => {
  focusManager.setFocused(state === "active");
});

Sentry.init({
  dsn: "https://855c2d0dc9e7b0455c34120af9239fb3@o4509785381404672.ingest.us.sentry.io/4509785386057729",
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null; // dev-only font blocking

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar style="dark" translucent />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
});
