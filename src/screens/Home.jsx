import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

const Home = () => {
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
    <SafeAreaView className="flex-1 bg-black px-8 items-center">
      <View className="w-full items-start mt-12">
        {/* subtitle */}
        <Text
          className="text-white text-xl"
          style={{ fontFamily: "Inter_700Bold" }}
        >
          Welcome back,
        </Text>
        {/* title */}
        <Text
          className="text-white text-5xl"
          style={{ fontFamily: "Inter_700Bold" }}
        >
          John!
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;
