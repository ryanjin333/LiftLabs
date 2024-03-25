import * as Haptics from "expo-haptics";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

import { Text, Pressable, ActivityIndicator } from "react-native";

const LoadingGenericButton = ({ onPress, title, color, isLoading }) => {
  const btnTapped = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
  };

  // fonts
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <Pressable
      className="h-16 w-full rounded-2xl justify-center items-center"
      style={{ backgroundColor: color }}
      onPress={btnTapped}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#000000" />
      ) : (
        <Text className="text-base" style={{ fontFamily: "Inter_600SemiBold" }}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default LoadingGenericButton;
