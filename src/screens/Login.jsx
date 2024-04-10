import { View, Text, Image } from "react-native";
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
import { loginUser } from "../context/userSlice";

const initialState = {
  email: "",
  password: "",
  screenVisible: true,
};

const Login = () => {
  const [values, setValues] = useState(initialState);
  const user = useSelector((state) => state.user);

  // redux
  const dispatch = useDispatch();

  // navigation
  const navigation = useNavigation();

  const onSubmit = async () => {
    const { email, password } = values;
    if (!email || !password) {
      // display alert
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
      // setTimeout(() => {
      //   setValues({ ...values, screenVisible: false });
      //   navigation.navigate("TabNavigator");
      // }, 2000);
      navigation.navigate("TabNavigator");
    }
  }, [user.uid]);

  const handleChange = (value, name) => {
    setValues({ ...values, [name]: value });
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
  return values.screenVisible ? (
    <SafeAreaView className="flex-1 bg-black px-6 items-center">
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
            handleChange={handleChange}
            value={values.email}
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
            handleChange={handleChange}
            isPassword={true}
            value={values.password}
          />
        </Animated.View>
        {/* login button */}
        <Animated.View
          className="w-full"
          entering={FadeInDown.delay(600).duration(1000).springify()}
          exiting={FadeOutUp}
        >
          <LoadingGenericButton
            title="Login"
            onPress={onSubmit}
            color={"#F0F2A6"}
            isLoading={user.isLoading}
          />
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
  ) : null;
};

export default Login;
