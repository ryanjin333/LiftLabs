import { View, Text } from "react-native";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

const OrSeparator = () => {
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
    <View className="flex-row items-center gap-2.5 mt-8">
      <View className="w-20 h-[3px] bg-white rounded-md" />
      <Text
        className="text-base text-white"
        style={{ fontFamily: "Inter_600SemiBold" }}
      >
        or
      </Text>
      <View className="w-20 h-[3px] bg-white rounded-md" />
    </View>
  );
};

export default OrSeparator;
