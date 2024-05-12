import { View, Text, Pressable } from "react-native";
import React from "react";

const ExerciseRow = ({ plan }) => {
  const { title, sets, weight, reps } = plan;
  return (
    <Pressable
      className="w-full h-16 bg-[#151515] flex-row  items-center "
      onPress={() => {
        console.log("bye");
      }}
    >
      <View className="  ml-5 ">
        <Text className="text-white text-base font-interSemiBold">{title}</Text>
        <Text className="text-[#848484] text-xs font-interSemiBold">
          {sets}x{reps} · {weight} lbs
        </Text>
      </View>
    </Pressable>
  );
};

export default ExerciseRow;
