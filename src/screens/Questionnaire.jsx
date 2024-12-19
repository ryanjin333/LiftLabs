import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";

// REMOVE LATER
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import { createNewWorkout } from "../context/workoutSlice";
import { createNewExercise } from "../context/exerciseSlice";

import OpenAI from "openai";

// Firebase imports
import { auth, db } from "../config/firebase";
import { doc, onSnapshot, getDoc, setDoc, updateDoc } from "firebase/firestore";

const Questionnaire = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});

  // redux
  const dispatch = useDispatch();

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
    // DUMMY VARIABLES
    const mainMuscle = "upper legs";
    const numberOfExercises = 6;
    const minuteBreak = 1;
    const secondBreak = 0;
    const weightSetting = "lbs"; // get from context

    // FOR WHEN UR CREATING A WORKOUT
    const exerciseRef = doc(db, "exercises", "allExercises");
    const exerciseSnap = await getDoc(exerciseRef);
    console.log("sending");

    if (exerciseSnap.exists()) {
      console.log("sent");

      const exercises = exerciseSnap.data().exercises;

      // Format exercises

      // Group exercises by `mainMuscle` put inside a useEffect once using fr
      const groupedByMainMuscle = exercises.reduce((groups, exercise) => {
        const muscle = exercise.mainMuscle || "Other"; // Default to "Other" if no `mainMuscle`
        if (!groups[muscle]) {
          groups[muscle] = [];
        }
        groups[muscle].push(exercise.name);
        return groups;
      }, {});

      // console.log(groupedByMainMuscle["upper legs"]);

      // Send to AI
      const openai = new OpenAI({
        apiKey:
          "sk-FD53WCJTLHLbaQNNet1BskPDUzmwdlV8seuxjY5r1DT3BlbkFJLqkSrl8fpcJhY982lNT0xIXd0Uxuod8wObhrlOAwkA",
      });
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `
              [no prose]
              [Output only JSON]
              Here is a list of ${mainMuscle} exercises: ${groupedByMainMuscle[mainMuscle]}. Please recommend ${numberOfExercises} effective exercises
               who is a ${responses[4]} year old ${responses[6]}kg ${responses[7]}cm ${responses[1]} gym goer. The exercises must be a ${responses[5]} 
               workout and focuses on ${responses[2]}. Only provide the name (you can only call the key name), recommended sets and reps, weight in ${weightSetting} not 
               including the unit of measurement in the parameters all in lowercase, absolutely nothing else. You may only display it in this following format: 
               [
                {
                  "name": "barbell front squat",
                  "sets": 3,
                  "weight": 22,
                  "reps": 15
                },
                {
                  "name": "dumbbell goblet squat",
                  "sets": 2,
                  "weight": 15,
                  "reps": 10
                }
              ].
              The workout should be ${responses[3]} but take into account a ${minuteBreak} minute ${secondBreak} second break in between each set.`,
            },
          ],
        });

        // Find the exercises that AI outputted in the original list and create a workout based on that

        // Create the workout

        // const newWorkout = {
        //   id: uuid.v4(),
        //   title: mainMuscle,
        //   image: require("../../assets/icon.png"),
        //   plan: [],
        //   createdBy: "AI",
        // };
        // dispatch(createNewWorkout(newWorkout));

        // Then add the exercises to the current workout
        const exercises = JSON.parse(completion.choices[0].message.content);

        exercises.map((exercise) => {
          // for each name, find the gif
          console.log(exercise.name);
          // const newExercise = {
          //   id: uuid.v4(),
          //   title: exerciseName,
          //   gif: exerciseGIF,
          //   sets: exercise.sets,
          //   reps: exercise.reps,
          //   weight: values.weight,
          // };
          // dispatch(createNewExercise(newExercise));
        });
      } catch (error) {
        console.error("OpenAI API error:", error);
      }
      console.log("completed");
    }
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.type === "number") {
      return (
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter a number"
          value={responses[currentQuestion.id] || ""}
          onChangeText={(text) => handleAnswer(text)}
        />
      );
    } else if (currentQuestion.type === "multipleChoice") {
      return (
        <FlatList
          data={currentQuestion.options}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleAnswer(item)}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      );
    } else {
      return <Text>Unknown question type</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        {questions[currentQuestionIndex].text}
      </Text>
      {renderQuestion()}
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={() =>
            currentQuestionIndex > 0 &&
            setCurrentQuestionIndex(currentQuestionIndex - 1)
          }
          disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.navButton}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            currentQuestionIndex < questions.length - 1
              ? setCurrentQuestionIndex(currentQuestionIndex + 1)
              : finishPressed()
          }
        >
          <Text style={styles.navButton}>
            {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  questionText: { fontSize: 20, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 20,
    borderRadius: 5,
  },
  navigation: { flexDirection: "row", justifyContent: "space-between" },
  navButton: { fontSize: 16, color: "blue" },
  option: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default Questionnaire;
