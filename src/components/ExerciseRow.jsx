import { View, Text, Pressable } from "react-native";
import React from "react";

// redux
import { useDispatch, useSelector } from "react-redux";
import { setEditModePlan, changeModalVisible } from "../context/exerciseSlice";

const ExerciseRow = ({ plan }) => {
  const { title, sets, weight, reps } = plan;

  // redux
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  return (
    <Pressable
      className="w-full h-16 bg-[#151515] flex-row  items-center "
      onPress={() => {
        dispatch(setEditModePlan(plan));
        dispatch(changeModalVisible(true));
      }}
    >
      <View className="  mx-5 ">
        <Text
          className="text-white text-base font-interSemiBold"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text className="text-[#848484] text-xs font-interSemiBold">
          {sets}x{reps} · {weight} {user.weight}
        </Text>
      </View>
    </Pressable>
  );
};

export default ExerciseRow;
