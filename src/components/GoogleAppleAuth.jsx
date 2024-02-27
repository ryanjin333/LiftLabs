import { View, Pressable, Image } from "react-native";

const GoogleAppleAuth = () => {
  const googleButtonTapped = () => {
    console.log("google button tapped");
  };
  const appleButtonTapped = () => {
    console.log("apple button tapped");
  };
  return (
    <View className="flex-row space-x-9 mt-3">
      <Pressable onPress={googleButtonTapped}>
        <Image
          className="w-9 h-9"
          style={{ resizeMode: "contain" }}
          source={require("../assets/google_logo.png")}
        />
      </Pressable>
    </View>
  );
};

export default GoogleAppleAuth;
