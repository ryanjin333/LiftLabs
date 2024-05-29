import { View, Text } from "react-native";
import { store } from "./src/context/store";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Login,
  Signup,
  Workout,
  TabNavigator,
  SearchExercise,
  Focus,
} from "./src/screens";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            //gestureEnabled: false,
          }}
        >
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
          <Stack.Screen name="Workout" component={Workout} />
          <Stack.Screen name="SearchExercise" component={SearchExercise} />
          <Stack.Screen name="Focus" component={Focus} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
