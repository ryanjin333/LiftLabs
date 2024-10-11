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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  GenericButton,
  FormRow,
  LoginSignupSwitcher,
  GoogleAppleAuth,
  LoadingGenericButton,
} from "../components";

import { auth, db } from "../config/firebase";

import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  where,
  collection,
} from "firebase/firestore";

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
import { showMessage, hideMessage } from "react-native-flash-message";

import { registerUser } from "../context/userSlice";
import { signupToLoginScreenTransition } from "../context/animationSlice";
import { useToggleAuth } from "../hooks";

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
  const signupScreenVisible = useSelector(
    (state) => state.animation.signupScreenVisible
  );

  // navigation
  const navigation = useNavigation();

  const onSubmit = async () => {
    // creates a new user and adds to the firestore collection users
    const { username, email, password } = values;
    if (!email || !password || !username) {
      // display alert
      showMessage({
        message: "Missing username, email or password",
        type: "danger",
      });
      return;
    }
    // IF USERNAME ALR EXISTS SHOW ERROR AND RETURN
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const usernameExists = await getDocs(q);
      if (!usernameExists.empty) {
        showMessage({
          message: "Username already exists",
          type: "danger",
        });
        return;
      }

      const currentUser = { username, email, password };
      dispatch(registerUser(currentUser));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setIsLoading(true));
        dispatch(signupToLoginScreenTransition());
        setTimeout(() => {
          navigation.replace("Loader");
        }, 500);
      }
    });
    return unsubscribe;
  }, []);

  // functions
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
          {signupScreenVisible && (
            <>
              {/* sign up text */}
              <View className="items-start w-full">
                <Animated.Text
                  className="text-white text-5xl mt-24 mb-16 font-interBold"
                  entering={FadeInUp.duration(500).springify()}
                  exiting={FadeOutUp.delay(300).duration(500).springify()}
                >
                  Sign up
                </Animated.Text>
              </View>
              {/* form layout */}
              <View className="mt-32 mb-7 gap-7 w-full items-center">
                <Animated.View
                  className="w-full"
                  entering={FadeInUp.delay(50).duration(500).springify()}
                  exiting={FadeOutUp.delay(250).duration(500).springify()}
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
                  entering={FadeInUp.delay(100).duration(500).springify()}
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
                  entering={FadeInUp.delay(150).duration(500).springify()}
                  exiting={FadeOutUp.delay(150).duration(500).springify()}
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
                  entering={FadeInUp.delay(200).duration(500).springify()}
                  exiting={FadeOutUp.delay(100).duration(500).springify()}
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
                  entering={FadeInUp.delay(250).duration(500).springify()}
                  exiting={FadeOutUp.delay(50).duration(500).springify()}
                >
                  {showGoogleAuth && <GoogleAppleAuth />}
                </Animated.View>

                {/* switch between login and sign up screens */}
                <View>
                  <Animated.View
                    className="w-full items-center"
                    entering={FadeInUp.delay(300).duration(500).springify()}
                    exiting={FadeOutUp.duration(500).springify()}
                  >
                    <LoginSignupSwitcher
                      isLogin={false}
                      onPress={() => dispatch(signupToLoginScreenTransition())}
                    />
                  </Animated.View>
                </View>
              </View>
            </>
          )}
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </>
  );
};

export default Signup;
