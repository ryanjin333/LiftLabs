import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import React from "react";

import Animated, {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutDown,
  useSharedValue,
  useScrollViewOffset,
  useAnimatedRef,
  useDerivedValue,
} from "react-native-reanimated";
import { AnimatedHeader } from "../components";

const User = () => {
  // animations
  const scrollViewAnimatedRef = useAnimatedRef();
  const scrollViewOffsetY = useScrollViewOffset(scrollViewAnimatedRef);

  const offsetY = useDerivedValue(() =>
    parseInt(scrollViewOffsetY.value.toFixed(1))
  );
  return (
    <>
      <AnimatedHeader offsetY={offsetY} title="User" />
      <Animated.ScrollView
        className="flex-1 bg-black"
        ref={scrollViewAnimatedRef}
      >
        <SafeAreaView className="flex-1 bg-black px-6 pb-32 items-center"></SafeAreaView>
      </Animated.ScrollView>
    </>
  );
};

export default User;
