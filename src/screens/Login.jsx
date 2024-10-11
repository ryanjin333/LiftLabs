import { View, Text, Image, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GenericButton,
  FormRow,
  LoginSignupSwitcher,
  GoogleAppleAuth,
  LoadingGenericButton,
  AnimatedHeader,
} from "../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { setIsLoading } from "../context/workoutSlice";
import { showMessage, hideMessage } from "react-native-flash-message";
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
import { loginUser } from "../context/userSlice";
import { auth, db } from "../config/firebase";
import {
  loginToHomeScreenTransition,
  loginToSignupScreenTransition,
  signupToLoginScreenTransition,
} from "../context/animationSlice";
import { doc, getDoc } from "firebase/firestore";
import { useToggleAuth } from "../hooks";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [values, setValues] = useState(initialState);
  const user = useSelector((state) => state.user);

  // redux
  const dispatch = useDispatch();
  const loginScreenVisible = useSelector(
    (state) => state.animation.loginScreenVisible
  );
  const alertText = useSelector((state) => state.user.alertText);
  useEffect(() => {
    console.log(alertText);
  }, [alertText]);

  // navigation
  const navigation = useNavigation();

  // functions

  const onSubmit = async () => {
    const { email, password } = values;
    if (!email || !password) {
      // display global alert
      showMessage({
        message: "Missing email or password",
        type: "danger",
      });
      return;
    }
    const currentUser = { email, password };
    try {
      dispatch(loginUser(currentUser));
    } catch (error) {
      console.log("got error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setIsLoading(true));
        dispatch(loginToHomeScreenTransition());
        setTimeout(() => {
          navigation.replace("Loader");
        }, 500);
      }
    });
    return unsubscribe;
  }, []);

  const handleChange = (value, name) => {
    setValues({ ...values, [name]: value });
  };

  // Google login toggle
  const showGoogleAuth = useToggleAuth();

  return (
    <>
      <KeyboardAwareScrollView
        className="flex-1 bg-black"
        keyboardShouldPersistTaps="always"
      >
        <SafeAreaView className="flex-1 bg-black px-6 items-center">
          {/* changes visibility of screen */}
          {loginScreenVisible && (
            <>
              {/* login text */}

              <View className="items-start w-full">
                <Animated.Text
                  className="text-white text-5xl mt-24 mb-16 font-interBold"
                  entering={FadeInUp.duration(500).springify()}
                  exiting={FadeOutUp.delay(250).duration(500).springify()}
                >
                  Login
                </Animated.Text>
              </View>
              {/* form layout */}
              <View className="mt-32 mb-7 gap-7 w-full items-center">
                <Animated.View
                  className="w-full"
                  entering={FadeInUp.delay(50).duration(500).springify()}
                  exiting={FadeOutUp.delay(200).duration(500).springify()}
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
                  entering={FadeInUp.delay(100).duration(500).springify()}
                  exiting={FadeOutUp.delay(150).duration(500).springify()}
                >
                  <FormRow
                    name="Password"
                    placeholder="Enter your Password"
                    handleChange={handleChange}
                    isPassword={true}
                    value={values.password}
                  />
                </Animated.View>
                {/* login button */}
                <Animated.View
                  className="w-full"
                  entering={FadeInUp.delay(150).duration(500).springify()}
                  exiting={FadeOutUp.delay(100).duration(500).springify()}
                >
                  <LoadingGenericButton
                    title="Login"
                    onPress={onSubmit}
                    isLoading={user.isLoading}
                  />
                </Animated.View>
                {/* Google or Apple sign in options */}
                <Animated.View
                  className="w-full items-center"
                  entering={FadeInUp.delay(200).duration(500).springify()}
                  exiting={FadeOutUp.delay(50).duration(500).springify()}
                >
                  {showGoogleAuth && <GoogleAppleAuth />}
                </Animated.View>
                {/* switch between login and sign up screens */}
                <Animated.View
                  className="w-full items-center"
                  entering={FadeInUp.delay(250).duration(500).springify()}
                  exiting={FadeOutUp.duration(500).springify()}
                >
                  <LoginSignupSwitcher
                    isLogin={true}
                    onPress={() => dispatch(loginToSignupScreenTransition())}
                  />
                </Animated.View>
              </View>
            </>
          )}
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </>
  );
};

export default Login;
