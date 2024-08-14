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

const LoadingGenericButton = ({
  onPress,
  title,
  isLoading,
  color = "#F0F2A6",
  textColor = "#000",
  loadingIndicatorColor = "#000000",
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
    onPress();
  };
  return (
    <AnimatedPressable
      className="h-14 w-full rounded-2xl justify-center items-center"
      style={[animatedStyle, { backgroundColor: color }]}
      onPress={btnTapped}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={loadingIndicatorColor} />
      ) : (
        <Text
          className="text-base font-interSemiBold"
          style={{ color: textColor }}
        >
          {title}
        </Text>
      )}
    </AnimatedPressable>
  );
};

export default LoadingGenericButton;
