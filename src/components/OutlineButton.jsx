import * as Haptics from "expo-haptics";
import { View, Text, Pressable } from "react-native";
import React from "react";

const OutlineButton = ({ title, onPress }) => {
  const btnTapped = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
  };
  return (
    <Pressable
      className="w-20 h-8 border border-[#2C2C2C] rounded-full items-center justify-center"
      onPress={btnTapped}
    >
      <Text className="text-white font-interMedium">{title}</Text>
    </Pressable>
  );
};

export default OutlineButton;
