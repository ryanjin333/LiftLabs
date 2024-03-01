import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GenericButton,
  FormRow,
  LoginSignupSwitcher,
  GoogleAppleAuth,
} from "../components";

// Firebase

import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

// Fonts
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

//Animations
import Animated from "react-native-reanimated";
import {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutDown,
} from "react-native-reanimated";

const Login = () => {
  // auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // navigation
  const navigation = useNavigation();

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
        <Animated.Text
          className="text-white text-5xl mt-24 mb-16"
          style={{ fontFamily: "Inter_700Bold" }}
          entering={FadeInDown.duration(1000).springify()}
          exiting={FadeOutUp}
        >
          Login
        </Animated.Text>
      </View>
      {/* form layout */}
      <View className="mt-32 mb-7 gap-7 w-full items-center">
        <Animated.View
          className="w-full"
          entering={FadeInDown.delay(200).duration(1000).springify()}
          exiting={FadeOutUp}
        >
          <FormRow
            name="Email"
            placeholder="Enter your email"
            handleChange={(value) => setEmail(value)}
            value={email}
          />
        </Animated.View>
        <Animated.View
          className="w-full"
          entering={FadeInDown.delay(400).duration(1000).springify()}
          exiting={FadeOutUp}
        >
          <FormRow
            name="Password"
            placeholder="Enter your Password"
            handleChange={(value) => setPassword(value)}
            isPassword={true}
            value={password}
          />
        </Animated.View>
        {/* login button */}
        <Animated.View
          className="w-full"
          entering={FadeInDown.delay(600).duration(1000).springify()}
          exiting={FadeOutUp}
        >
          <GenericButton title="Login" onPress={onSubmit} color={"#F0F2A6"} />
        </Animated.View>
        {/* Google or Apple sign in options */}
        <Animated.View
          className="w-full items-center"
          entering={FadeInDown.delay(1000).duration(1000).springify()}
          exiting={FadeOutUp}
        >
          <GoogleAppleAuth />
        </Animated.View>
        {/* switch between login and sign up screens */}
        <Animated.View
          className="w-full items-center"
          entering={FadeInDown.delay(800).duration(1000).springify()}
          exiting={FadeOutUp}
        >
          <LoginSignupSwitcher isLogin={true} />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
