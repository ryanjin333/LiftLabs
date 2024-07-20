import {
  View,
  Text,
  Pressable,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
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
import { setIsLoading } from "../context/workoutSlice";

//Animations
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutDown,
  useSharedValue,
  useScrollViewOffset,
  useAnimatedRef,
  useDerivedValue,
} from "react-native-reanimated";

import { registerUser } from "../context/userSlice";

const initialState = {
  username: "",
  email: "",
  password: "",
  signupScreenVisible: true,
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
      console.log("missing username, email, or alert");
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
      // if user successfully signs up, also set loading of the workouts list to true
      dispatch(setIsLoading(true));
      setValues({ ...values, signupScreenVisible: false });
      setTimeout(() => {
        navigation.navigate("TabNavigator");
      }, 1000);
    }
  }, [user.uid]);

  // functions
  const handleChange = (value, name) => {
    setValues({ ...values, [name]: value });
  };
  return (
    <>
      <ScrollView className="flex-1 bg-black">
        <SafeAreaView className="flex-1 bg-black px-6 items-center">
          {values.signupScreenVisible && (
            <>
              {/* sign up text */}
              <View className="items-start w-full">
                <Animated.Text
                  className="text-white text-5xl mt-24 mb-16 font-interBold"
                  entering={FadeInUp.duration(1000).springify()}
                  exiting={FadeOutUp.delay(500).duration(1000).springify()}
                >
                  Sign up
                </Animated.Text>
              </View>
              {/* form layout */}
              <View className="mt-32 mb-7 gap-7 w-full items-center">
                <Animated.View
                  className="w-full"
                  entering={FadeInUp.delay(100).duration(1000).springify()}
                  exiting={FadeOutUp.delay(500).duration(1000).springify()}
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
                  entering={FadeInUp.delay(200).duration(1000).springify()}
                  exiting={FadeOutUp.delay(400).duration(1000).springify()}
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
                  entering={FadeInUp.delay(300).duration(1000).springify()}
                  exiting={FadeOutUp.delay(300).duration(1000).springify()}
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
                  entering={FadeInUp.delay(400).duration(1000).springify()}
                  exiting={FadeOutUp.delay(200).duration(1000).springify()}
                >
                  <LoadingGenericButton
                    title="Sign up"
                    onPress={onSubmit}
                    isLoading={user.isLoading}
                  />
                </Animated.View>
                {/* Google or Apple sign in options */}
                <Animated.View
                  className="w-full items-center"
                  entering={FadeInUp.delay(500).duration(1000).springify()}
                  exiting={FadeOutUp.delay(100).duration(1000).springify()}
                >
                  <GoogleAppleAuth />
                </Animated.View>
                {/* switch between login and sign up screens */}
                <Animated.View
                  className="w-full items-center"
                  entering={FadeInUp.delay(600).duration(1000).springify()}
                  exiting={FadeOutUp.duration(1000).springify()}
                >
                  <LoginSignupSwitcher
                    isLogin={false}
                    onPress={() =>
                      setValues({ ...values, signupScreenVisible: false })
                    }
                  />
                </Animated.View>
              </View>
            </>
          )}
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

export default Signup;
