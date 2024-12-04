import { View, Text } from "react-native";
import { useEffect, useRef } from "react";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { countdownToFocusScreenTransition } from "../context/animationSlice";

const Countdown = () => {
  const navigation = useNavigation();

  // redux
  const dispatch = useDispatch();
  const countdownScreenVisible = useSelector(
    (state) => state.animation.countdownScreenVisible
  );
  return (
    <View className="flex-1 bg-black items-center justify-center">
      {countdownScreenVisible && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
        >
          <CountdownCircleTimer
            isPlaying
            duration={3}
            colors={"#000000"}
            onComplete={() => {
              // do your stuff here

              dispatch(countdownToFocusScreenTransition());

              setTimeout(() => {
                navigation.navigate("Focus");
              }, 600);
            }}
            onUpdate={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            }}
            trailColor="#000000"
          >
            {({ remainingTime }) => (
              <Text className="font-interBold text-7xl text-white">
                {remainingTime}
              </Text>
            )}
          </CountdownCircleTimer>
        </Animated.View>
      )}
    </View>
  );
};

export default Countdown;
