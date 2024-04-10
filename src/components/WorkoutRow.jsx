import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

const WorkoutRow = ({ title, image, plan, createdBy }) => {
  const navigation = useNavigation();
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
      className="w-full h-20 bg-[#151515] flex-row rounded-[18px] items-center mb-3.5"
      onPress={() => {
        navigation.navigate("Workout", { title, plan });
      }}
    >
      <Image
        className="h-16 w-16 rounded-[18px] overflow-hidden ml-2 mr-6"
        source={image}
      />
      <View className="">
        <Text
          className="text-white mb-5 text-base"
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          {title}
        </Text>
        <Text
          className="text-[#848484] text-xs"
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          {plan.length} Exercise{plan.length == 1 ? "" : "s"}
        </Text>
      </View>
    </Pressable>
  );
};

export default WorkoutRow;
