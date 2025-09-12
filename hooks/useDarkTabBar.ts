import { useEffect } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";

export function useDarkTabBar() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isFocused) return;

    navigation.setOptions({
      // tabBarStyle: {
      //   backgroundColor: "#0b1220",
      //   borderTopColor: "rgba(255,255,255,0.08)",
      // },
      tabBarActiveTintColor: "#0077ffff",
      tabBarInactiveTintColor: "#94a3b8",
    });

    return () => {
      navigation.setOptions({
        tabBarStyle: undefined,
        tabBarActiveTintColor: undefined,
        tabBarInactiveTintColor: undefined,
      });
    };
  }, [isFocused, navigation]);

  return { isFocused };
}
