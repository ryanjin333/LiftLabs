import { View, Text } from "react-native";
import { store } from "./src/context/store";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Login,
  Signup,
  Workout,
  TabNavigator,
  SearchExercise,
  Focus,
  SearchUser,
  Loader,
} from "./src/screens";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
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
            <Stack.Screen name="SearchExercise" component={SearchExercise} />
            <Stack.Screen
              name="Focus"
              component={Focus}
              options={{ animation: "none" }}
            />
            <Stack.Screen name="SearchUser" component={SearchUser} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
