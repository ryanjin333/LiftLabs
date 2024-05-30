import { View, Text } from "react-native";
import React from "react";

import { BlurView } from "expo-blur";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutDown,
} from "react-native-reanimated";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const AnimatedHeader = () => {
  // animations
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.85, { damping: 20, stiffness: 100 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 100 });
  };
  return (
    <AnimatedBlurView
      className=" w-screen items-start justify-end h-36 absolute top-0 left-0 right-0 z-10 pl-6"
      tint="dark"
      intensity={70}
    >
      {/* title */}
      <Animated.Text
        className="text-white text-4xl font-interBold mt-16"
        entering={FadeInUp.duration(1000).springify()}
        exiting={FadeOutUp.delay(300).duration(1000).springify()}
      >
        Workouts
      </Animated.Text>
    </AnimatedBlurView>
  );
};

export default AnimatedHeader;
