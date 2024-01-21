import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

import { View, Text, Pressable } from "react-native";
import React from "react";

const BlurButton = ({ onPress, title }) => {
  const btnTapped = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
  };
  return (
    <Pressable
      className="h-16 w-full rounded-2xl overflow-hidden"
      onPress={btnTapped}
    >
      <BlurView
        className="h-16 w-full justify-center items-center"
        intensity={30}
      >
        <Text className="text-white text-base">{title}</Text>
      </BlurView>
    </Pressable>
  );
};

export default BlurButton;
