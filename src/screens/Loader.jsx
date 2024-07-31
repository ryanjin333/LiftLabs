import { View, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";

const Loader = ({ navigation }) => {
  // redux
  const dispatch = useDispatch();
  const workout = useSelector((state) => state.workout);

  // initial load data
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace("TabNavigator");
      } else {
        navigation.replace("Login");
      }
    });

    return () => {
      if (unsub) unsub();
    };
  }, [auth, dispatch, navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default Loader;
