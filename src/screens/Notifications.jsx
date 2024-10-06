import { View, Text, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

// redux imports
import { useSelector, useDispatch } from "react-redux";

// reanimated imports
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutDown,
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { AnimatedHeader, WorkoutRow } from "../components";

const Notifications = () => {
  // redux
  const workout = useSelector((state) => state.workout);

  // animations
  const offsetY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    offsetY.value = event.contentOffset.y;
  });

  return (
    <>
      <AnimatedHeader offsetY={offsetY} title="Notifications" animate={false} />
      <Animated.ScrollView className="flex-1 bg-black" onScroll={scrollHandler}>
        <View className="h-24" />
        <SafeAreaView className="flex-1 bg-black px-6 pb-32 items-center">
          <View className="w-full">
            <Animated.View className="w-full">
              {/* pending workouts */}
              {workout.pendingWorkouts.length == 0 ? (
                <View className="flex-1 items-center mt-20">
                  <Image source="" />
                  <Text className=" text-white  font-interMedium text-lg">
                    {"Nothing to see here :)"}
                  </Text>
                </View>
              ) : (
                <View className="w-full mt-7">
                  <FlatList
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    data={workout.pendingWorkouts}
                    renderItem={({ item }) => (
                      <WorkoutRow currentWorkout={item} isNotification={true} />
                    )}
                    keyExtractor={(item) =>
                      `${item.id}-${workout.dropdownTitle}`
                    }
                  />
                </View>
              )}
            </Animated.View>
          </View>
        </SafeAreaView>
      </Animated.ScrollView>
    </>
  );
};

export default Notifications;
