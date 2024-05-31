import { View, Text, Dimensions } from "react-native";
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
  useAnimatedProps,
  useDerivedValue,
} from "react-native-reanimated";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const AnimatedHeader = ({ offsetY }) => {
  // animations

  const screenWidth = Dimensions.get("window").width;
  const center = screenWidth / 2;
  const textWidth = 196 + 60;

  // changes title style

  const translateX = useDerivedValue(() => {
    return offsetY.value > 30
      ? withTiming(center - textWidth / 2)
      : withTiming(0);
  });
  const translateY = useDerivedValue(() => {
    return offsetY.value > 30 ? withTiming(-20) : withTiming(0);
  });
  const scale = useDerivedValue(() => {
    return offsetY.value > 30 ? withTiming(0.5) : withTiming(1);
  });

  // changes header style

  const blurIntensity = useDerivedValue(() => {
    return offsetY.value > 30 ? withTiming(70) : withTiming(0);
  });
  const headerHeight = useDerivedValue(() => {
    return offsetY.value > 30 ? withTiming(100) : withTiming(128);
  });

  // styling

  const textViewAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { scale: scale.value },
      ],
    };
  });

  const blurViewAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: headerHeight.value,
    };
  });

  return (
    <AnimatedBlurView
      className=" w-screen items-start justify-end h-36 absolute top-0 left-0 right-0 z-10 pl-6"
      tint="dark"
      intensity={blurIntensity}
      style={blurViewAnimatedStyle}
    >
      {/* title */}
      <Animated.View style={textViewAnimatedStyle}>
        <Animated.Text
          className="text-white text-4xl font-interBold mt-16 w-48 text-center"
          entering={FadeInUp.duration(1000).springify()}
          exiting={FadeOutUp.delay(300).duration(1000).springify()}
        >
          Workouts
        </Animated.Text>
      </Animated.View>
    </AnimatedBlurView>
  );
};

export default AnimatedHeader;
