import { View, Text, ImageBackground } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormRow } from "../components";

export default function Login() {
  const handleChange = () => {
    print("hi");
  };

  return (
    <SafeAreaView className="flex-1 bg-black px-8">
      <Text className="text-white text-5xl">Login</Text>
      <View className="flex-1 space-y-14 my-14 h-80 bg-slate-500">
        <FormRow
          className="mb-14"
          name="Username"
          placeholder="Enter your username"
          handleChange={handleChange}
          value=""
        />
        <FormRow
          name="Password"
          placeholder="Enter your Password"
          handleChange={handleChange}
          isPassword={true}
          value=""
        />
      </View>
    </SafeAreaView>
  );
}
