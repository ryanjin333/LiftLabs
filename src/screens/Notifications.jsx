import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

// reanimated imports
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

const Notifications = () => {
  // animations
  const scrollViewAnimatedRef = useAnimatedRef();
  const scrollViewOffsetY = useScrollViewOffset(scrollViewAnimatedRef);

  const offsetY = useDerivedValue(() =>
    parseInt(scrollViewOffsetY.value.toFixed(1))
  );

  return (
    <>
      <AnimatedHeader offsetY={offsetY} title="Notifications" />
      <Animated.ScrollView
        className="flex-1 bg-black"
        ref={scrollViewAnimatedRef}
      >
        <SafeAreaView className="flex-1 bg-black px-6 pb-32 items-center"></SafeAreaView>
      </Animated.ScrollView>
    </>
  );
};

export default Notifications;
