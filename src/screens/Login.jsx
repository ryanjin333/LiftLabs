import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GenericButton,
  FormRow,
  OrSeparator,
  LoginSignupSwitcher,
} from "../components";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
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
      {/* login text */}
      <View className="items-start w-full">
        <Text
          className="text-white text-5xl mt-24 mb-16"
          style={{ fontFamily: "Inter_700Bold" }}
        >
          Login
        </Text>
      </View>
      {/* form layout */}
      <View className="mt-32 mb-7 gap-7 w-full items-center">
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
            placeholder="Enter your Password"
            handleChange={(value) => setPassword(value)}
            isPassword={true}
            value={password}
          />
        </View>
      </View>
      {/* login button */}
      <GenericButton title="Log in" onPress={onSubmit} />
      {/* or separator */}
      <OrSeparator />
      {/* Google or Apple sign in options */}
      {/* switch between login and sign up screens */}
      <LoginSignupSwitcher isLogin />
    </SafeAreaView>
  );
};

export default Login;
