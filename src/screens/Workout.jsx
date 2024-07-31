import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ScrollView,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect } from "react";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import { changeModalVisible } from "../context/exerciseSlice";
import { workoutToHomeScreenTransition } from "../context/animationSlice";

// reanimated imports
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutDown,
  useSharedValue,
  useAnimatedScrollHandler,
  useDerivedValue,
} from "react-native-reanimated";

import {
  ExerciseRow,
  OutlineButton,
  OutlineButtonCircle,
  AddExerciseModal,
  FocusStartButton,
  AnimatedHeader,
} from "../components";

const Workout = ({ route, navigation }) => {
  const { title, plan } = route.params;

  // redux
  const dispatch = useDispatch();
  const currentWorkout = useSelector((state) => state.exercise.currentWorkout);
  const workoutScreenVisible = useSelector(
    (state) => state.animation.workoutScreenVisible
  );

  // animations
  const offsetY = useSharedValue(0); // scroll

  const scrollHandler = useAnimatedScrollHandler((event) => {
    offsetY.value = event.contentOffset.y;
  });

  //const viewableItems = useSharedValue<ViewToken[]>([])

  return (
    <View className="bg-black w-full h-full">
      {workoutScreenVisible && (
        <>
          <AnimatedHeader offsetY={offsetY} title={title} delay={250} />
          <Animated.ScrollView
            className="flex-1 bg-black"
            onScroll={scrollHandler}
          >
            <View className="h-24" />
            <SafeAreaView className="flex-1 bg-black px-6 pb-40 items-center">
              {/* button bar */}
              <View className="w-full flex-row justify-between mt-6">
                <View className="flex-row space-x-1">
                  <Animated.View
                    entering={FadeInUp.delay(50).duration(500).springify()}
                    exiting={FadeOutUp.delay(200).duration(500).springify()}
                  >
                    <OutlineButtonCircle
                      image={"back_chevron"}
                      onPress={() => {
                        dispatch(workoutToHomeScreenTransition());
                        setTimeout(() => {
                          navigation.goBack();
                        }, 750);
                      }}
                    />
                  </Animated.View>
                  <Animated.View
                    entering={FadeInUp.delay(100).duration(500).springify()}
                    exiting={FadeOutUp.delay(150).duration(500).springify()}
                  >
                    <OutlineButton
                      title="Share"
                      onPress={() => navigation.navigate("SearchUser")}
                    />
                  </Animated.View>
                </View>
                <Animated.View
                  entering={FadeInUp.delay(150).duration(500).springify()}
                  exiting={FadeOutUp.delay(100).duration(500).springify()}
                >
                  <OutlineButton
                    title="+ Add"
                    onPress={() => dispatch(changeModalVisible(true))}
                  />
                </Animated.View>
              </View>
              <View className="w-full items-center">
                <Animated.View
                  className="w-full"
                  entering={FadeInUp.delay(200).duration(500).springify()}
                  exiting={FadeOutUp.delay(50).duration(500).springify()}
                >
                  {/* exercise list */}
                  {currentWorkout.plan.length == 0 ? (
                    <View className="flex-1 justify-center items-center mt-20">
                      <Text className="text-center text-white w-44 font-inter">
                        Tap <Text className="font-interBold">Add</Text> to
                        create a new exercise
                      </Text>
                    </View>
                  ) : (
                    <View className="w-full mt-6 rounded-[18px]">
                      <FlatList
                        scrollEnabled={false}
                        className="rounded-[18px] "
                        data={currentWorkout.plan ? currentWorkout.plan : plan}
                        renderItem={({ item }) => <ExerciseRow plan={item} />}
                        keyExtractor={(item) => item.id}
                      />
                    </View>
                  )}
                </Animated.View>
              </View>

              <AddExerciseModal />
            </SafeAreaView>
          </Animated.ScrollView>

          <Animated.View
            entering={FadeInUp.delay(250).duration(500).springify()}
            exiting={FadeOutDown.duration(500).springify()}
          >
            <FocusStartButton />
          </Animated.View>
        </>
      )}
    </View>
  );
};

export default Workout;
