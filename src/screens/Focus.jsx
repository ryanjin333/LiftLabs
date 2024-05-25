import { View, Text, Dimensions, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

const data = [
  { key: "1", text: "Page 1" },
  { key: "2", text: "Page 2" },
  { key: "3", text: "Page 3" },
  // Add more data as needed
];

const Focus = () => {
  return (
    <FlatList
      className="bg-black"
      data={data}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => (
        <View className="h-screen w-screen justify-center items-center bg-black">
          <SafeAreaView>
            <Text className="text-white">{item.text}</Text>
          </SafeAreaView>
        </View>
      )}
      snapToInterval={Dimensions.get("window").height}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Focus;
