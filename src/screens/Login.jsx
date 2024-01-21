import { View, Text, ImageBackground } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurButton, FormRow } from "../components";

export default function Login() {
  const handleChange = () => {
    console.log("hi");
  };

  const onSubmit = () => {
    console.log("ok");
  };

  return (
    <SafeAreaView className="flex-1 bg-black px-8">
      <Text className="text-white text-5xl mt-32">Login</Text>
      <View className="mt-32 mb-7">
        <FormRow
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
      <BlurButton title="Log in" onPress={onSubmit} />
    </SafeAreaView>
  );
}
