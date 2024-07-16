import { View, Text, FlatList } from "react-native";
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
  useScrollViewOffset,
  useAnimatedRef,
  useDerivedValue,
} from "react-native-reanimated";
import { AnimatedHeader, WorkoutRow } from "../components";

const Notifications = () => {
  // redux
  const workout = useSelector((state) => state.workout);

  // animations
  const scrollViewAnimatedRef = useAnimatedRef();
  const scrollViewOffsetY = useScrollViewOffset(scrollViewAnimatedRef);

  const offsetY = useDerivedValue(() =>
    parseInt(scrollViewOffsetY.value.toFixed(1))
  );

  return (
    <>
      <AnimatedHeader offsetY={offsetY} title="Notifications" />
      <Animated.ScrollView
        className="flex-1 bg-black"
        ref={scrollViewAnimatedRef}
      >
        <View className="h-24" />
        <SafeAreaView className="flex-1 bg-black px-6 pb-32 items-center">
          {/* pending workouts */}
          {workout.pendingWorkouts.length == 0 ? (
            <View className="flex-1 items-center mt-20">
              <Text className="text-center text-white w-44 font-inter text-lg">
                {"No new notifications"}
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
                keyExtractor={(item) => `${item.id}-${workout.dropdownTitle}`}
              />
            </View>
          )}
        </SafeAreaView>
      </Animated.ScrollView>
    </>
  );
};

export default Notifications;
