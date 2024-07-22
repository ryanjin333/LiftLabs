import { View, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { auth } from "../config/firebase";

const Loader = ({ navigation }) => {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("ran");
      if (user) {
        navigation.replace("TabNavigator"); // User is logged in, navigate to TabNavigator
      } else {
        navigation.replace("Login"); // User is not logged in, navigate to Login
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [navigation]);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default Loader;
