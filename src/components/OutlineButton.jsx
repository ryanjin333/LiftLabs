import * as Haptics from "expo-haptics";
import { View, Text, Pressable } from "react-native";
import React from "react";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

const OutlineButton = ({ title, onPress }) => {
  const btnTapped = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
  };

  // fonts
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <Pressable
      className="w-20 h-8 border border-[#2C2C2C] rounded-full items-center justify-center"
      onPress={btnTapped}
    >
      <Text className="text-white" style={{ fontFamily: "Inter_500Medium" }}>
        {title}
      </Text>
    </Pressable>
  );
};

export default OutlineButton;
