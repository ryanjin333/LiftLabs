import { View, Text, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  FadeInUp,
  FadeOutUp,
} from "react-native-reanimated";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const AnimatedHeader = ({ offsetY, title, delay = 300, animate = true }) => {
  const screenWidth = Dimensions.get("window").width;
  const centerX = screenWidth / 2;
  const [textWidth, setTextWidth] = useState(0);

  const handleTextLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setTextWidth(width);
  };

  const insets = useSafeAreaInsets();
  const centerY = 41 / 4; // half of header height
  const scrollTrigger = 30;

  // Animation values
  const translateX = useDerivedValue(() => {
    return offsetY.value > scrollTrigger
      ? withTiming(centerX - textWidth / 2 - 24)
      : withTiming(0);
  });

  const translateY = useDerivedValue(() => {
    return offsetY.value > scrollTrigger ? withTiming(centerY) : withTiming(0);
  });

  const scale = useDerivedValue(() => {
    return offsetY.value > scrollTrigger ? withTiming(0.5) : withTiming(1);
  });

  const blurIntensity = useDerivedValue(() => {
    return offsetY.value > scrollTrigger ? withTiming(70) : withTiming(0);
  });

  const headerHeight = useDerivedValue(() => {
    return offsetY.value > scrollTrigger
      ? withTiming(insets.top + 41)
      : withTiming(insets.top + 69);
  });

  const [intensity, setIntensity] = useState(0);

  // Effect to sync intensity with animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIntensity(blurIntensity.value);
    }, 16); // Sync roughly every frame (60fps)
    return () => clearInterval(interval);
  }, [blurIntensity]);

  // Styles
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
      className="w-screen items-start justify-end h-36 absolute top-0 left-0 right-0 z-10 px-6"
      tint="dark"
      intensity={intensity} // Dynamic intensity from state
      style={blurViewAnimatedStyle}
    >
      <Animated.View style={textViewAnimatedStyle}>
        <Animated.Text
          className="text-white text-4xl font-interBold mt-16 h-10"
          onLayout={handleTextLayout}
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
