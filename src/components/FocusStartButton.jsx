import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import * as Haptics from "expo-haptics";

import { useNavigation } from "@react-navigation/native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FocusStartButton = () => {
  // navigation
  const navigation = useNavigation();
  // animations
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    console.log("pressed");
    scale.value = withSpring(0.85, { damping: 20, stiffness: 200 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 200 });
  };

  // functions
  const buttonPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    navigation.navigate("Focus");
  };
  return (
    <AnimatedPressable
      style={animatedStyle}
      className="bg-primary rounded-full h-20 w-20 justify-center items-center"
      onPress={buttonPressed}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Image
        style={{ resizeMode: "contain" }}
        source={require("../assets/play_button.png")}
        className="h-8 w-8"
      ></Image>
    </AnimatedPressable>
  );
};

export default FocusStartButton;
