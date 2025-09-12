import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export const TopLoadingBar = ({ visible }: { visible: boolean }) => {
  const bar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    bar.setValue(0);
    Animated.timing(bar, {
      toValue: 1,
      duration: 700,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [visible, bar]);

  const width = bar.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "120%"],
  });
  if (!visible) return null;

  return <Animated.View style={[styles.loadingBar, { width }]} />;
};

const styles = StyleSheet.create({
  loadingBar: {
    height: 3,
    backgroundColor: "#111827",
    marginHorizontal: 16,
    borderRadius: 3,
    marginBottom: 8,
  },
});
