import React, { useEffect } from "react";
import { View, Pressable, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import { GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { useDispatch } from "react-redux";
import { showMessage } from "react-native-flash-message";
import { GoogleAppleAuthHelper } from "../helpers/components";

WebBrowser.maybeCompleteAuthSession();

const GoogleAppleAuth = ({ type = "google" }) => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId:
      "811062416555-fsq78k7il4gv3r6k4tet6jju4gvie12k.apps.googleusercontent.com",
    androidClientId:
      "811062416555-vpej2sh9rr6cb573qs45ceki9udo2kt0.apps.googleusercontent.com",
  });

  // redux
  const dispatch = useDispatch();

  useEffect(() => {
    const handleGoogleSignIn = async () => {
      if (response?.type === "success") {
        const { id_token } = response.params;

        try {
          const credential = GoogleAuthProvider.credential(id_token);

          // LOGGED IN
          const { handleSocialAuth } = GoogleAppleAuthHelper;
          await handleSocialAuth(credential, dispatch);
        } catch (error) {
          console.error("Error during sign-in with Google:", error);
          showMessage({
            message: "Google sign-in failed. Please try again.",
            type: "danger",
          });
        }
      } else if (response?.type === "error") {
        console.error("Google sign-in error:", response.error);
        showMessage({
          message: "Google sign-in failed. Please try again.",
          type: "danger",
        });
      }
    };

    handleGoogleSignIn();
  }, [response]);

  const appleButtonPressed = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });

      const { identityToken } = credential;

      if (identityToken) {
        const provider = new OAuthProvider("apple.com");

        // create firebase auth
        const firebaseCredential = provider.credential({
          idToken: identityToken,
          rawNonce: null, // Optional if you include nonce during Apple Sign-In
        });

        // LOGGED IN
        const { handleSocialAuth } = GoogleAppleAuthHelper;
        await handleSocialAuth(firebaseCredential, dispatch);
      } else {
        console.error("Apple Sign-In did not return an identity token.");
      }
    } catch (e) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        // handle that the user canceled the sign-in flow
        console.log("error 1");
      } else {
        // handle other errors
        console.log("error 2", e);
      }
    }
  };

  return (
    <View className="flex-row space-x-9 mt-3">
      <Pressable onPress={() => promptAsync()}>
        <Image
          className="w-9 h-9"
          style={{ resizeMode: "contain" }}
          source={require("../assets/google_logo.png")}
        />
      </Pressable>
      <Pressable onPress={appleButtonPressed}>
        <Image
          className="w-9 h-9"
          style={{ resizeMode: "contain" }}
          source={require("../assets/apple_logo.png")}
        />
      </Pressable>
    </View>
  );
};

export default GoogleAppleAuth;
