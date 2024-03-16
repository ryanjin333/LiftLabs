import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "./Home";
import Search from "./Search";
import User from "./User";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        //gestureEnabled: false,
        tabBarStyle: {
          backgroundColor: "black",
          borderBlockColor: "black",
        },
        tabBarLabelStyle: { display: "none" },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused
              ? require("../assets/home_icon_bold.png")
              : require("../assets/home_icon_thin.png");
          } else if (route.name === "Search") {
            iconName = focused
              ? require("../assets/search_icon_bold.png")
              : require("../assets/search_icon_thin.png");
          } else if (route.name === "User") {
            iconName = focused
              ? require("../assets/user_icon_bold.png")
              : require("../assets/user_icon_thin.png");
          }
          return <Image source={iconName} style={{ width: 25, height: 25 }} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="User" component={User} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
