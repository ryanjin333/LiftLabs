import { View, Text, FlatList, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

const Home = () => {
  WORKOUTS = [
    {
      id: "1",
      title: "Chest",
      image: require("../assets/React_Native_Logo.png"),
      plan: [],
      createdBy: "uid",
    },
    {
      id: "2",
      title: "Arms",
      image: require("../assets/React_Native_Logo.png"),
      plan: [],
      createdBy: "uid",
    },
    {
      id: "3",
      title: "Shoulders",
      image: require("../assets/React_Native_Logo.png"),
      plan: [],
      createdBy: "uid",
    },
  ];

  // fonts
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const Item = ({ title, image, plan, createdBy }) => (
    <View className="w-full h-20 bg-[#151515] flex-row rounded-[18px] items-center mb-3.5">
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
          {plan.length} Exercises
        </Text>
      </View>
    </View>
  );
  return (
    <SafeAreaView className="flex-1 bg-black px-8 items-center">
      <View className="w-full items-start mt-16">
        {/* title */}
        <Text
          className="text-white text-4xl"
          style={{ fontFamily: "Inter_700Bold" }}
        >
          Workouts
        </Text>
      </View>
      <FlatList
        className="w-full mt-20"
        data={WORKOUTS}
        renderItem={({ item }) => (
          <Item
            title={item.title}
            image={item.image}
            plan={item.plan}
            createdBy={item.createdBy}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default Home;
