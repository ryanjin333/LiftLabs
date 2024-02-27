import { View, Text, Pressable } from "react-native";
import React from "react";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

const TaskCard = () => {
  // fonts
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View>
      <View>
        <View>
          <Text className="" style={{ fontFamily: "Inter_400Regular" }}>
            Quick Start
          </Text>
          <Text className="text-3xl" style={{ fontFamily: "Inter_700Bold" }}>
            Legs
          </Text>
        </View>
        <View>
          <Text className="text-xl" style={{ fontFamily: "Inter_600SemiBold" }}>
            Tuesday
          </Text>
          <Text className="text-sm" style={{ fontFamily: "Inter_600SemiBold" }}>
            9 Jan 2024
          </Text>
        </View>
      </View>
      <Pressable className="bg-white">
        <Text>Begin</Text>
      </Pressable>
    </View>
  );
};

export default TaskCard;
