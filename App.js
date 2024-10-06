import { useState } from "react";
import { View, Text } from "react-native";
import { store } from "./src/context/store";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FlashMessage from "react-native-flash-message";
import { useFonts } from "expo-font";

import {
  Login,
  Signup,
  Workout,
  TabNavigator,
  SearchExercise,
  Focus,
  SearchUser,
  Loader,
  Done,
  Splash,
} from "./src/screens";

const Stack = createNativeStackNavigator();

function App() {
  // splash animation
  const [splashCompleted, setSplashComplete] = useState(false);
  const handleSplashEnd = () => {
    setSplashComplete(true); // Hide the splash screen after video ends
  };

  // load fonts
  const [fontsLoaded] = useFonts({
    "Inter-Thin": require("./assets/Fonts/Inter-Thin.ttf"),
    Inter_ExtraLight: require("./assets/Fonts/Inter-ExtraLight.ttf"),
    Inter_Light: require("./assets/Fonts/Inter-Light.ttf"),
    "Inter-Regular": require("./assets/Fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("./assets/Fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("./assets/Fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("./assets/Fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("./assets/Fonts/Inter-ExtraBold.ttf"),
    "Inter-Black": require("./assets/Fonts/Inter-Black.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        {!splashCompleted ? (
          <Splash onSplashEnd={handleSplashEnd} />
        ) : (
          <>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="Loader"
                screenOptions={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              >
                <Stack.Screen
                  name="Loader"
                  component={Loader}
                  options={{ animation: "none" }}
                />
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{ animation: "none" }}
                />
                <Stack.Screen
                  name="Signup"
                  component={Signup}
                  options={{ animation: "none" }}
                />
                <Stack.Screen
                  name="TabNavigator"
                  component={TabNavigator}
                  options={{ animation: "none" }}
                />
                <Stack.Screen
                  name="Workout"
                  component={Workout}
                  options={{ animation: "none" }}
                />
                <Stack.Screen
                  name="SearchExercise"
                  component={SearchExercise}
                />
                <Stack.Screen
                  name="Focus"
                  component={Focus}
                  options={{ animation: "none" }}
                />
                <Stack.Screen
                  name="Done"
                  component={Done}
                  options={{ animation: "none" }}
                />
                <Stack.Screen name="SearchUser" component={SearchUser} />
              </Stack.Navigator>
            </NavigationContainer>
            <FlashMessage position="top" />
          </>
        )}
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
