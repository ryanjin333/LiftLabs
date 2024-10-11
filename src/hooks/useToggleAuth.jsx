import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const useToggleAuth = () => {
  const [showGoogleAuth, setShowGoogleAuth] = useState(false);
  useEffect(() => {
    const getGoogleBooleanData = async () => {
      const googleLoginRef = doc(db, "commands", "google");
      const googleLoginSnap = await getDoc(googleLoginRef);

      setShowGoogleAuth(googleLoginSnap.data().showGoogleLogin);
    };
    getGoogleBooleanData();
  }, []);
  return showGoogleAuth;
};

export default useToggleAuth;
