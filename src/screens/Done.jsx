import { View, Text, Pressable } from "react-native";
import React from "react";

const Done = ({ navigation }) => {
  return (
    <View className="justify-center items-center">
      <Pressable
        className="w-10 h-10 bg-primary"
        onPress={navigation.navigate("Home")}
      />
    </View>
  );
};

export default Done;
