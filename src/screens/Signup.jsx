import { View, Text, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GenericButton,
  FormRow,
  LoginSignupSwitcher,
  GoogleAppleAuth,
  LoadingGenericButton,
} from "../components";

import { useNavigation } from "@react-navigation/native";

// Redux
import { useSelector, useDispatch } from "react-redux";

//Animations
import Animated from "react-native-reanimated";
import {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutDown,
} from "react-native-reanimated";
import { registerUser } from "../context/userSlice";

const initialState = {
  username: "",
  email: "",
  password: "",
};

const Signup = () => {
  const [values, setValues] = useState(initialState);
  const user = useSelector((state) => state.user);

  // redux
  const dispatch = useDispatch();

  // navigation
  const navigation = useNavigation();

  const onSubmit = async () => {
    // creates a new user and adds to the firestore collection users
    const { username, email, password } = values;
    if (!email || !password || !username) {
      // display alert
      return;
    }
    const currentUser = { username, email, password };
    try {
      dispatch(registerUser(currentUser));
    } catch (error) {
      console.log("got error:", error);
    }
  };

  useEffect(() => {
    if (user.uid) {
      navigation.navigate("TabNavigator");
    }
  }, [user.uid]);

  const handleChange = (value, name) => {
    setValues({ ...values, [name]: value });
  };
  return (
    <SafeAreaView className="flex-1 bg-black px-6 items-center">
      {/* sign up text */}
      <View
        className="items-start w-full"
        entering={FadeInUp.duration(1000).springify()}
        exiting={FadeOutDown}
      >
        <Animated.Text
          className="text-white text-5xl mt-24 mb-16 font-interBold"
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
            handleChange={handleChange}
            value={values.username}
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
            handleChange={handleChange}
            value={values.email}
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
            handleChange={handleChange}
            isPassword={true}
            value={values.password}
          />
        </Animated.View>
        {/* sign up button */}
        <Animated.View
          className="w-full"
          entering={FadeInDown.delay(800).duration(1000).springify()}
          exiting={FadeOutUp}
        >
          <LoadingGenericButton
            title="Sign up"
            onPress={onSubmit}
            color={"#F0F2A6"}
            isLoading={user.isLoading}
          />
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
