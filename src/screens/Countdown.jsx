import { View, Text } from "react-native";
import { useEffect, useRef } from "react";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

const Countdown = () => {
  const navigation = useNavigation();
  return (
    <View className="items-center justify-center bg-black flex-1">
      <Text>Countdown</Text>
      <CountdownCircleTimer
        isPlaying
        duration={3}
        colors={"#fff"}
        onComplete={() => {
          // do your stuff here
          navigation.navigate("Focus");
          //   return { shouldRepeat: true, delay: 1.5 }; // repeat animation in 1.5 seconds
        }}
        onUpdate={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        }}
        trailColor="#585858"
      >
        {({ remainingTime }) => (
          <Text className="font-interBold text-5xl text-white">
            {remainingTime}
          </Text>
        )}
      </CountdownCircleTimer>
    </View>
  );
};

export default Countdown;
