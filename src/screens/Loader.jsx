import { View, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { auth, db } from "../config/firebase"; // Ensure db is imported
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { doc, onSnapshot } from "firebase/firestore";
import { fetchWorkouts } from "../context/workoutSlice";
import { loadInfo } from "../context/userSlice";

const Loader = ({ navigation }) => {
  // redux
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", auth.currentUser.uid);
          const unsubscribeSnapshot = onSnapshot(
            docRef,
            (docSnapshot) => {
              if (docSnapshot.exists()) {
                dispatch(fetchWorkouts(docSnapshot.data()));
                dispatch(loadInfo());
              }
            },
            (error) => {
              console.error("Error fetching document:", error);
            }
          );

          navigation.replace("TabNavigator");

          // Return the cleanup function for the onSnapshot listener
          return () => unsubscribeSnapshot();
        } catch (error) {
          console.error("Error setting up snapshot listener:", error);
        }
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
