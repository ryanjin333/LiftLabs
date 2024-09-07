import React, { useEffect } from "react";
import { View, Pressable, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../config/firebase";

WebBrowser.maybeCompleteAuthSession();

const GoogleAppleAuth = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId:
      "811062416555-fsq78k7il4gv3r6k4tet6jju4gvie12k.apps.googleusercontent.com",
    androidClientId:
      "811062416555-vpej2sh9rr6cb573qs45ceki9udo2kt0.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (result) => {
          const currentUser = {
            username: result.user.displayName || "DefaultUsername", // Extracted or default username
            email: result.user.email,
            password: "GoogleAuth", // Not needed, but included for consistency
          };

          // Dispatch the registerUser thunk
          const userId = await dispatch(registerUser(currentUser));

          if (userId) {
            showMessage({
              message: "User registered successfully!",
              type: "success",
            });
          }
        })
        .catch((error) => {
          console.error("Error during sign-in with Google:", error);
          showMessage({
            message: "Google sign-in failed. Please try again.",
            type: "danger",
          });
        });
    } else if (response?.type === "error") {
      console.error("Google sign-in error:", response.error);
      showMessage({
        message: "Google sign-in failed. Please try again.",
        type: "danger",
      });
    }
  }, [response]);

  return (
    <View className="flex-row space-x-9 mt-3">
      <Pressable onPress={() => promptAsync()}>
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
