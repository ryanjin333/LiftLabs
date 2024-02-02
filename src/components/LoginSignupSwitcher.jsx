import { Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { useNavigation } from "@react-navigation/native";

const LoginSignupSwitcher = ({ isLogin }) => {
  // navigation
  const navigation = useNavigation();
  const btnTapped = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (isLogin) {
      navigation.navigate("Signup");
    } else {
      navigation.navigate("Login");
    }
  };
  // fonts
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <Pressable className="flex-row mt-20" onPress={btnTapped}>
      <Text
        className="text-[#D6D6D6] text-sm"
        style={{ fontFamily: "Inter_400Regular" }}
      >
        {isLogin ? "Don't have an Account? " : "Already have an account? "}
      </Text>
      <Text
        className="text-white text-sm"
        style={{ fontFamily: "Inter_700Bold" }}
      >
        {isLogin ? "Sign up" : "Log in"}
      </Text>
    </Pressable>
  );
};

export default LoginSignupSwitcher;
