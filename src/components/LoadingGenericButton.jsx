import * as Haptics from "expo-haptics";
import { Text, Pressable, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const LoadingGenericButton = ({ onPress, title, isLoading }) => {
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
    onPress();
  };
  return (
    <AnimatedPressable
      style={animatedStyle}
      className="h-14 w-full rounded-2xl justify-center items-center bg-primary"
      onPress={btnTapped}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#000000" />
      ) : (
        <Text className="text-base font-interSemiBold">{title}</Text>
      )}
    </AnimatedPressable>
  );
};

export default LoadingGenericButton;
