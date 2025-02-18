import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

const GradientBlur = ({
  children,
  className = "",
  direction = "fromBottom",
}) => {
  return (
    <LinearGradient
      colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]} // Adjust colors to control opacity
      start={direction == "fromBottom" ? { x: 0, y: 1 } : { x: 0, y: 0 }}
      end={direction == "fromBottom" ? { x: 0, y: 0 } : { x: 0, y: 1 }}
      className={`${className} pointer-events-none`}
      pointerEvents="none"
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fullSize: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default GradientBlur;
