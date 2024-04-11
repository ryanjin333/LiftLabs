import { View, Text, Pressable } from "react-native";
import React from "react";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

const ExerciseRow = ({ plan }) => {
  const { title, sets, weight, reps } = plan;
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
    <Pressable
      className="w-full h-16 bg-[#151515] flex-row  items-center "
      onPress={() => {
        console.log("bye");
      }}
    >
      <View className="  ml-5 ">
        <Text
          className="text-white text-base"
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          {title}
        </Text>
        <Text
          className="text-[#848484] text-xs"
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          {sets}x{reps} · {weight} lbs
        </Text>
      </View>
    </Pressable>
  );
};

export default ExerciseRow;
