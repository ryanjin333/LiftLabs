import * as Haptics from "expo-haptics";
import { Text, Pressable, ActivityIndicator } from "react-native";

const LoadingGenericButton = ({ onPress, title, color, isLoading }) => {
  const btnTapped = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
  };
  return (
    <Pressable
      className="h-16 w-full rounded-2xl justify-center items-center"
      style={{ backgroundColor: color }}
      onPress={btnTapped}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#000000" />
      ) : (
        <Text className="text-base font-interSemiBold">{title}</Text>
      )}
    </Pressable>
  );
};

export default LoadingGenericButton;
