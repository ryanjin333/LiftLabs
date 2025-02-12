import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  GradientBlur,
  GradientButton,
  RoundedBlurView,
  ScrollSelector,
} from "../components";

import { LinearGradient } from "expo-linear-gradient";

import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Picker } from "@react-native-picker/picker";
import { submitData } from "../context/userSlice";

const initialState = {
  1: "Intermediate", // level
  2: "General fitness", // goals
  3: "30 min to 1 hour", // length
  4: 18, // age
  5: "Male oriented", // gender
  6: 180, // weight
  7: 175, // height
};

const Questionnaire = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState(initialState);

  // react native navigation
  const navigation = useNavigation();

  // redux
  const dispatch = useDispatch();

  // insets
  const insets = useSafeAreaInsets();

  const questions = [
    {
      id: 1,
      text: "First, what is your fitness level",
      type: "multipleChoice",
      options: ["Beginner", "Intermediate", "Advanced"],
    },
    {
      id: 2,
      text: "Next, what are your fitness goals",
      type: "multipleChoice",
      options: ["Weight loss", "Muscle gain", "General fitness"],
    },
    {
      id: 3,
      text: "How long do you plan to work out",
      type: "multipleChoice",
      options: ["Under 30 min", "30 min to 1 hour", "1+ hours"],
    },
    { id: 4, text: "What is your age?", type: "number" },
    {
      id: 5,
      text: "What type of workout do you prefer?",
      type: "multipleChoice",
      options: ["Male oriented", "Female oriented"],
    },
    { id: 6, text: "How heavy are you", type: "number" },
    { id: 7, text: "How tall are you", type: "number" },
  ];

  const handleAnswer = (answer) => {
    setResponses((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer,
    }));
  };

  const finishPressed = async () => {
    console.log(responses);
    dispatch(submitData(responses));
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.type === "number") {
      return (
        <>
          <View
            className={`absolute left-0 right-0 z-0`}
            style={{
              top: insets.top,
              bottom: insets.bottom,
            }}
          >
            <ScrollSelector handleAnswer={handleAnswer} />
          </View>
        </>
      );
    } else if (currentQuestion.type === "multipleChoice") {
      return (
        // <FlatList
        //   data={currentQuestion.options}
        //   renderItem={({ item }) => (
        //     <TouchableOpacity
        //       className="w-full h-16 mb-6 rounded-full justify-center items-center bg-black border border-[#363636]"
        //       onPress={() => handleAnswer(item)}
        //     >
        //       <Text className=" text-white font-interMedium text-lg">
        //         {item}
        //       </Text>
        //     </TouchableOpacity>
        //   )}
        //   keyExtractor={(item, index) => index.toString()}
        // />
        <View className="flex-row flex-wrap px-6 -mt-24">
          {currentQuestion.options.map((item, index) => (
            // individual workout selection views
            <LinearGradient
              colors={["#3d3d3d", "#1b1b1b"]} // Customize gradient colors
              locations={[0, 0.2]}
              start={[0, 0]}
              end={[0, 1]} // Top to bottom gradient
              className="rounded-[20px] m-0.5 p-[1px]"
              key={index}
            >
              <View
                key={item}
                className="rounded-[20px] bg-[#181818] " // Transparent border to retain gradient
                style={{ width: 160, height: 160 }}
              >
                {/* Top half of the selection view */}
                <View className="flex-row justify-between">
                  {/* Apply shadowing to the radial gradient */}
                  <View
                    style={{
                      borderRadius: 9999,
                      shadowColor: "#3d3d3d",
                      shadowOffset: { width: 0, height: 5 },
                      shadowOpacity: 0.6,
                      shadowRadius: 15,
                      elevation: 15, // For Android
                    }}
                  >
                    <Text>hi</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          ))}
        </View>
      );
    } else {
      return <Text>Unknown question type</Text>;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black px-6 justify-between ">
      <View className="z-10">
        <View className="w-full items-center bg-black">
          <Text className="text-white font-interBold mt-10  text-4xl ">
            {questions[currentQuestionIndex].text}
          </Text>
        </View>
        {questions[currentQuestionIndex].type == "number" && (
          <GradientBlur className="w-full h-48" direction="fromBottom" />
        )}
      </View>

      {renderQuestion()}

      {/* navigation buttons */}
      <View>
        {questions[currentQuestionIndex].type == "number" && (
          <GradientBlur className="w-full h-48" direction="fromTop" />
        )}
        <View className=" flex-row justify-between bg-black">
          {/* go back button */}
          <TouchableOpacity
            onPress={() =>
              currentQuestionIndex > 0 &&
              setCurrentQuestionIndex(currentQuestionIndex - 1)
            }
            disabled={currentQuestionIndex === 0}
            className="bg-[#272727] h-16 w-16 rounded-full justify-center items-center mb-10"
          >
            <Image
              source={require("../assets/reverse.png")}
              className="h-7 w-7"
            />
          </TouchableOpacity>

          {/* next button */}
          {/* <TouchableOpacity
            onPress={() =>
              currentQuestionIndex < questions.length - 1
                ? setCurrentQuestionIndex(currentQuestionIndex + 1)
                : finishPressed()
            }
            className="bg-[#272727] h-16 w-48 rounded-full justify-center items-center"
          >
            <Text className=" text-white font-interMedium text-lg">
              {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
            </Text>
          </TouchableOpacity> */}

          {/* gradient next button */}
          <View className=" mb-5 w-48">
            <GradientButton
              title={
                currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"
              }
              onPress={() =>
                currentQuestionIndex < questions.length - 1
                  ? setCurrentQuestionIndex(currentQuestionIndex + 1)
                  : finishPressed()
              }
            />
          </View>

          {/* dummy button */}

          <View className="h-16 w-16" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#000000",
    padding: 8,
    marginBottom: 20,
    borderRadius: 5,
  },
  option: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default Questionnaire;
