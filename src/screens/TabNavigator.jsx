import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Animated from "react-native-reanimated";
import {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutDown,
} from "react-native-reanimated";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

import { BlurView } from "expo-blur";

import Home from "./Home";
import Notifications from "./Notifications";
import User from "./User";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  // redux
  const tabScreenVisible = useSelector(
    (state) => state.animation.tabScreenVisible
  );
  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            borderTopWidth: 0,
            height: insets.bottom + 46,
          },
          tabBarBackground: () => (
            <>
              {tabScreenVisible && (
                <AnimatedBlurView
                  tint="dark"
                  intensity={70}
                  className="bg-transparent overflow-hidden w-full h-full"
                  entering={FadeInDown.delay(600).duration(1000).springify()}
                  exiting={FadeOutUp.duration(1000).springify()}
                />
              )}
            </>
          ),
          tabBarLabelStyle: { display: "none" },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused
                ? require("../assets/home_icon_bold.png")
                : require("../assets/home_icon_thin.png");
            } else if (route.name === "Notifications") {
              iconName = focused
                ? require("../assets/notification_icon_bold.png")
                : require("../assets/notification_icon_thin.png");
            } else if (route.name === "User") {
              iconName = focused
                ? require("../assets/user_icon_bold.png")
                : require("../assets/user_icon_thin.png");
            }
            return (
              <>
                {tabScreenVisible && (
                  <Animated.Image
                    source={iconName}
                    style={{ width: 25, height: 25 }}
                    entering={FadeInDown.delay(600).duration(1000).springify()}
                    exiting={FadeOutUp.duration(1000).springify()}
                  />
                )}
              </>
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen
          name="Notifications"
          component={Notifications}
          options={{ title: "Notifications" }}
        />
        <Tab.Screen name="User" component={User} />
      </Tab.Navigator>
    </>
  );
};

export default TabNavigator;
