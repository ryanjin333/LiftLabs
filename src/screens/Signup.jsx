import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GenericButton,
  FormRow,
  LoginSignupSwitcher,
  GoogleAppleAuth,
} from "../components";

import { useNavigation } from "@react-navigation/native";

// Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";

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

const Signup = () => {
  // auth
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // navigation
  const navigation = useNavigation();

  const onSubmit = async () => {
    // creates a new user and adds to the firestore collection users
    if (username && email && password) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          username: username,
          email: email,
          workouts: [
            {
              id: "4324325",
              title: "Chest",
              image: require("../assets/React_Native_Logo.png"),
              plan: [
                {
                  title: "Dumbbell Chest Press",
                  sets: 3,
                  weight: 55,
                  reps: 8,
                  id: "1",
                },
                {
                  title: "Dumbbell Incline Chest Press",
                  sets: 3,
                  weight: 45,
                  reps: 8,
                  id: "2",
                },
              ],
              createdBy: "uid",
            },
            {
              id: "42354345245",
              title: "Arms",
              image: require("../assets/React_Native_Logo.png"),
              plan: [
                {
                  title: "Bicep curls",
                  sets: 3,
                  weight: 30,
                  reps: 8,
                  id: "3",
                },
              ],
              createdBy: "uid",
            },
            {
              id: "432425233442",
              title: "Shoulders",
              image: require("../assets/React_Native_Logo.png"),
              plan: [
                {
                  title: "Shoulder Press",
                  sets: 3,
                  weight: 40,
                  reps: 8,
                  id: "4",
                },
                {
                  title: "Overhead Shoulder Press",
                  sets: 3,
                  weight: 45,
                  reps: 8,
                  id: "5",
                },
                {
                  title: "Machine Shoulder Press",
                  sets: 3,
                  weight: 120,
                  reps: 8,
                  id: "6",
                },
              ],
              createdBy: "uid",
            },
          ],
          sharedWorkouts: [],
        });
        navigation.navigate("TabNavigator");
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
    <SafeAreaView className="flex-1 bg-black px-6 items-center">
      {/* sign up text */}
      <View
        className="items-start w-full"
        entering={FadeInUp.duration(1000).springify()}
        exiting={FadeOutDown}
      >
        <Animated.Text
          className="text-white text-5xl mt-24 mb-16"
          style={{ fontFamily: "Inter_700Bold" }}
          entering={FadeInDown.duration(1000).springify()}
          exiting={FadeOutUp}
        >
          Sign up
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
            name="username"
            placeholder="Create a username"
            handleChange={(value) => setUsername(value)}
            value={username}
          />
        </Animated.View>
        <Animated.View
          className="w-full"
          entering={FadeInDown.delay(400).duration(1000).springify()}
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
          entering={FadeInDown.delay(600).duration(1000).springify()}
          exiting={FadeOutUp}
        >
          <FormRow
            name="Password"
            placeholder="Create a Password"
            handleChange={(value) => setPassword(value)}
            isPassword={true}
            value={password}
          />
        </Animated.View>
        {/* sign up button */}
        <Animated.View
          className="w-full"
          entering={FadeInDown.delay(800).duration(1000).springify()}
          exiting={FadeOutUp}
        >
          <GenericButton title="Sign up" onPress={onSubmit} color={"#F0F2A6"} />
        </Animated.View>
        {/* Google or Apple sign in options */}
        <Animated.View
          className="w-full items-center"
          entering={FadeInDown.delay(1200).duration(1000).springify()}
          exiting={FadeOutUp}
        >
          <GoogleAppleAuth />
        </Animated.View>
        {/* switch between login and sign up screens */}
        <Animated.View
          className="w-full items-center"
          entering={FadeInDown.delay(1000).duration(1000).springify()}
          exiting={FadeOutUp}
        >
          <LoginSignupSwitcher isLogin={false} />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default Signup;
