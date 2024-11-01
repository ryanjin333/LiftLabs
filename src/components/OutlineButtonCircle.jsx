import * as Haptics from "expo-haptics";
import { View, Image, Pressable } from "react-native";
import React from "react";

import { LinearGradient } from "expo-linear-gradient";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OutlineButtonCircle = ({ image, onPress }) => {
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
      className="w-8 h-8  rounded-full items-center justify-center"
      onPress={btnTapped}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Shadow view for button */}
      <View
        className="w-full h-full justify-center items-center rounded-full"
        style={{
          borderRadius: 9999,
          shadowColor: "#ffffff",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.9,
          shadowRadius: 25,
          elevation: 25, // For Android
        }}
      >
        <LinearGradient
          // Button Linear Gradient
          colors={["#ffffffe1", "#ffffff67"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full h-full justify-center items-center rounded-full"
        >
          <Image
            source={require("../assets/back_chevron.png")}
            className="w-4 h-4"
          />
        </LinearGradient>
      </View>
    </AnimatedPressable>
  );
};

export default OutlineButtonCircle;
