import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const useBouncingAnimation = () => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 700 }),
        withTiming(0, { duration: 700 }),
        withTiming(8, { duration: 700 }),
        withTiming(0, { duration: 700 }),
        withTiming(0, { duration: 1400 })
      ),
      -1, // Infinite repeat
      false // No reverse
    );
  }, [translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
};

export default useBouncingAnimation;
