import { useEffect } from "react";
import { Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

const LoginSignupSwitcher = ({ isLogin, onPress }) => {
  // navigation
  const navigation = useNavigation();
  const btnTapped = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
    // let animation finish then switch screen
    let duration = isLogin ? 800 : 900;
    setTimeout(() => {
      if (isLogin) {
        navigation.navigate("Signup");
      } else {
        navigation.navigate("Login");
      }
    }, duration);
  };
  return (
    <Pressable className="flex-row" onPress={btnTapped}>
      <Text className="text-[#D6D6D6] text-sm font-inter">
        {isLogin ? "Don't have an Account? " : "Already have an account? "}
      </Text>
      <Text className="text-white text-sm font-interBold">
        {isLogin ? "Sign up" : "Log in"}
      </Text>
    </Pressable>
  );
};

export default LoginSignupSwitcher;
