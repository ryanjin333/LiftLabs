import { View, Text, Dimensions } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

const AnimatedHeader = ({ offsetY, title, delay = 300 }) => {
  // animations

  const screenWidth = Dimensions.get("window").width;
  const centerX = screenWidth / 2;
  const [textWidth, setTextWidth] = useState(0);

  const handleTextLayout = (event) => {
    // handles dynamic text width
    const { width } = event.nativeEvent.layout;
    setTextWidth(width);
  };

  const insets = useSafeAreaInsets();
  const centerY = 41 / 2; // half of header height

  // changes title style

  const translateX = useDerivedValue(() => {
    return offsetY.value > 30
      ? withTiming(centerX - textWidth / 2 - 24) // center - half of text width - px-6
      : withTiming(0);
  });
  const translateY = useDerivedValue(() => {
    return offsetY.value > 30 ? withTiming(-centerY) : withTiming(0);
  });
  const scale = useDerivedValue(() => {
    return offsetY.value > 30 ? withTiming(0.5) : withTiming(1);
  });

  // changes header style

  const blurIntensity = useDerivedValue(() => {
    return offsetY.value > 30 ? withTiming(70) : withTiming(0);
  });
  const headerHeight = useDerivedValue(() => {
    return offsetY.value > 30
      ? withTiming(insets.top + 41)
      : withTiming(insets.top + 69);
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
      experimentalBlurMethod="dimezisBlurView"
      className=" w-screen items-start justify-end h-36 absolute top-0 left-0 right-0 z-10 px-6"
      tint="dark"
      intensity={blurIntensity}
      style={blurViewAnimatedStyle}
    >
      {/* title */}
      <Animated.View style={textViewAnimatedStyle}>
        <Animated.Text
          className="text-white text-4xl font-interBold mt-16 h-10"
          onLayout={handleTextLayout}
          entering={FadeInUp.duration(500).springify()}
          exiting={FadeOutUp.delay(delay).duration(500).springify()}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Animated.Text>
      </Animated.View>
    </AnimatedBlurView>
  );
};

export default AnimatedHeader;
