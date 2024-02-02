import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GenericButton,
  FormRow,
  OrSeparator,
  LoginSignupSwitcher,
} from "../components";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

const Signup = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    if (name && email && password) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        navigation.navigate("Home");
      } catch (error) {
        console.log("got error:", error);
      }
    }
  };

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
      {/* sign up text */}
      <View className="items-start w-full">
        <Text
          className="text-white text-5xl mt-24 mb-16"
          style={{ fontFamily: "Inter_700Bold" }}
        >
          Sign up
        </Text>
      </View>
      {/* form layout */}
      <View className="mt-32 mb-7 gap-7 w-full items-center">
        <View className="w-full">
          <FormRow
            name="name"
            placeholder="Enter your full name"
            handleChange={(value) => setName(value)}
            value={name}
          />
        </View>
        <View className="w-full">
          <FormRow
            name="Email"
            placeholder="Enter your email"
            handleChange={(value) => setEmail(value)}
            value={email}
          />
        </View>
        <View className="w-full">
          <FormRow
            name="Password"
            placeholder="Create a Password"
            handleChange={(value) => setPassword(value)}
            isPassword={true}
            value={password}
          />
        </View>
      </View>
      {/* login button */}
      <GenericButton title="Sign up" onPress={onSubmit} />
      {/* or separator */}
      <OrSeparator />
      {/* Google or Apple sign in options */}
      {/* switch between login and sign up screens */}
      <LoginSignupSwitcher isLogin={false} />
    </SafeAreaView>
  );
};

export default Signup;
