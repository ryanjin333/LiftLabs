import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedStopwatchTimer = forwardRef(({ textStyle }, ref) => {
  const [time, setTime] = useState(0); // Time in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const opacity = useSharedValue(1); // Shared value for fade effect

  // Timer interval reference
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, []);

  // Start timer
  const startTimer = () => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTime((prev) => prev + 1000); // Increment time by 1 second
    }, 1000);

    // Animate fade-in effect
    opacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  };

  // Stop timer
  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);

    // Animate fade-out effect
    opacity.value = withTiming(0.5, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  };

  // Reset timer
  const resetTimer = () => {
    stopTimer();
    setTime(0);
  };

  // Format time into MM:SS
  const formatTime = () => {
    const minutes = Math.floor(time / 60000)
      .toString()
      .padStart(1, "0");
    const seconds = Math.floor((time % 60000) / 1000)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Allow parent component to access methods and current time
  useImperativeHandle(ref, () => ({
    startTimer,
    stopTimer,
    resetTimer,
    getTime: () => time, // Provide current time in milliseconds
    getFormattedTime: formatTime, // Provide formatted time
  }));

  // Animated style for opacity
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle]}>
      <Text style={[styles.timeText, textStyle]}>{formatTime()}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  timeText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default AnimatedStopwatchTimer;
