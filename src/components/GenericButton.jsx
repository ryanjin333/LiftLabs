import * as Haptics from "expo-haptics";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

import { Text, Pressable } from "react-native";

const GenericButton = ({ onPress, title, color }) => {
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
      <Text className="text-base" style={{ fontFamily: "Inter_600SemiBold" }}>
        {title}
      </Text>
    </Pressable>
  );
};

export default GenericButton;
