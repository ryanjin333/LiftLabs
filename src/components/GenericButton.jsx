import * as Haptics from "expo-haptics";
import { Text, Pressable } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GenericButton = ({
  onPress,
  title,
  color = "#F0F2A6",
  textColor = "#000",
}) => {
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

  // functions
  const btnTapped = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    onPress();
  };
  return (
    <AnimatedPressable
      className="h-14 w-full rounded-2xl justify-center items-center"
      style={[animatedStyle, { backgroundColor: color }]}
      onPress={btnTapped}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text
        className="text-base font-interSemiBold"
        style={{ color: textColor }}
      >
        {title}
      </Text>
    </AnimatedPressable>
  );
};

export default GenericButton;
