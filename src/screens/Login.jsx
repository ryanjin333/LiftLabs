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
      <FormRow
        name="Email"
        placeholder="Enter your email"
        handleChange={handleChange}
        value="email"
      />
    </SafeAreaView>
  );
}
