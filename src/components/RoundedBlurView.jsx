import { View, Text } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";

const RoundedBlurView = ({
  children,
  className = "",
  containerClassName = "",
  style = {},
}) => {
  return (
    <View className={`overflow-hidden ${className}`}>
      <BlurView
        intensity={60}
        tint="dark"
        className={` ${containerClassName}`}
        style={style}
      >
        {children}
      </BlurView>
    </View>
  );
};

export default RoundedBlurView;
