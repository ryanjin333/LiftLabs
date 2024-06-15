import * as Haptics from "expo-haptics";
import { View, Text, Pressable } from "react-native";
import React from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OutlineButton = ({ title, onPress }) => {
  // animations
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.85, {
      damping: 20,
      stiffness: 300,
    });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  };

  // standard functions
  const btnTapped = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    onPress();
  };
  return (
    <AnimatedPressable
      style={animatedStyle}
      className="w-20 h-8 border border-[#2C2C2C] rounded-full items-center justify-center"
      onPress={btnTapped}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text className="text-white font-interMedium">{title}</Text>
    </AnimatedPressable>
  );
};

export default OutlineButton;
