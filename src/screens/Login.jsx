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
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { setIsLoading } from "../context/workoutSlice";
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

const initialState = {
  email: "",
  password: "",
  loginScreenVisible: true,
};

const Login = () => {
  const [values, setValues] = useState(initialState);
  const user = useSelector((state) => state.user);

  // redux
  const dispatch = useDispatch();

  // navigation
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    // activates when transitioning to another screen and then back
    const unsubscribe = navigation.addListener("transitionEnd", () => {
      if (isFocused) {
        setValues({ ...values, loginScreenVisible: true });
      }
    });

    return unsubscribe;
  }, [navigation, isFocused]);

  // animations
  const scrollViewAnimatedRef = useAnimatedRef();
  const scrollViewOffsetY = useScrollViewOffset(scrollViewAnimatedRef);

  const offsetY = useDerivedValue(() =>
    parseInt(scrollViewOffsetY.value.toFixed(1))
  );

  // functions

  const onSubmit = async () => {
    const { email, password } = values;
    if (!email || !password) {
      // display alert
      console.log("missing email or password");
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
    if (user.uid) {
      // if user successfully logs in, also set loading of the workouts list to true
      dispatch(setIsLoading(true));
      setValues({ ...values, loginScreenVisible: false });
      setTimeout(() => {
        navigation.navigate("TabNavigator");
      }, 1000);
    }
  }, [user.uid]);

  const handleChange = (value, name) => {
    setValues({ ...values, [name]: value });
  };

  return (
    <>
      {/* changes visibility of screen */}
      {values.loginScreenVisible && (
        <>
          <AnimatedHeader offsetY={offsetY} title="Login" />
          <Animated.ScrollView
            className="flex-1 bg-black"
            ref={scrollViewAnimatedRef}
          >
            <View className=" h-40" />

            <SafeAreaView className="flex-1 bg-black px-6 items-center">
              {/* form layout */}
              <View className="mt-32 mb-7 gap-7 w-full items-center">
                <Animated.View
                  className="w-full"
                  entering={FadeInUp.delay(100).duration(1000).springify()}
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
                  entering={FadeInUp.delay(200).duration(1000).springify()}
                  exiting={FadeOutUp.delay(300).duration(1000).springify()}
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
                  entering={FadeInUp.delay(300).duration(1000).springify()}
                  exiting={FadeOutUp.delay(200).duration(1000).springify()}
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
                  entering={FadeInUp.delay(400).duration(1000).springify()}
                  exiting={FadeOutUp.delay(100).duration(1000).springify()}
                >
                  <GoogleAppleAuth />
                </Animated.View>
                {/* switch between login and sign up screens */}
                <Animated.View
                  className="w-full items-center"
                  entering={FadeInUp.delay(500).duration(1000).springify()}
                  exiting={FadeOutUp.duration(1000).springify()}
                >
                  <LoginSignupSwitcher
                    isLogin={true}
                    onPress={() =>
                      setValues({ ...values, loginScreenVisible: false })
                    }
                  />
                </Animated.View>
              </View>
            </SafeAreaView>
          </Animated.ScrollView>
        </>
      )}
    </>
  );
};

export default Login;
