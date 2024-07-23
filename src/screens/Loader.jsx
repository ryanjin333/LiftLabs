import { View, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Loader = ({ navigation }) => {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace("TabNavigator");
      } else {
        navigation.replace("Login");
      }
    });
    return unsub;
  }, [auth]);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default Loader;
