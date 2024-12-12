import { useState, useEffect } from "react";
import { Dimensions, Platform } from "react-native";

export const useHasNotch = () => {
  const [hasNotch, setHasNotch] = useState(false);

  useEffect(() => {
    const { width, height } = Dimensions.get("window");

    // iPhone models with a notch typically have an aspect ratio >= 2.1
    const aspectRatio = height / width;

    // Check if it's an iPhone and has a notch based on aspect ratio
    if (Platform.OS === "ios") {
      setHasNotch(aspectRatio >= 2.1);
    }
  }, []);

  return hasNotch;
};
