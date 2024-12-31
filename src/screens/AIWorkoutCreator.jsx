import { View, Text } from "react-native";
import React from "react";
import { createNewWorkout } from "../context/workoutSlice";
import uuid from "react-native-uuid";

import OpenAI from "openai";

// Firebase imports
import { auth, db } from "../config/firebase";
import { doc, onSnapshot, getDoc, setDoc, updateDoc } from "firebase/firestore";

const AIWorkoutCreator = () => {
  const generateWorkoutPressed = async () => {
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

      // Create a relationship where key is name and value is gif so that gifs can easily be found
      const nameToGifMap = exercises.reduce((map, exercise) => {
        map[exercise.name] = exercise.gif;
        return map;
      }, {});

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
               workout and focuses on ${responses[2]}. Only provide the name already provided in the list word for word (you can only call the key name), recommended sets and reps, weight in ${weightSetting} not
               including the unit of measurement in the parameters all in lowercase and only have it in intervals of 5s or 10s, absolutely nothing else. You may only display it in this following format:
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

        // Combine the plan for workout creation
        const aiOutput = JSON.parse(completion.choices[0].message.content);

        const plan = aiOutput.map((exercise) => ({
          id: uuid.v4(),
          title: exercise.name,
          gif: nameToGifMap[exercise.name], // Match the gif based on the exercise name
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
        }));
        console.log(plan);

        // TODO: if a plan is undefined run AI again

        // Create the workout

        const newWorkout = {
          id: uuid.v4(),
          title: mainMuscle,
          image: require("../../assets/icon.png"),
          plan: plan,
          createdBy: "AI",
        };
        dispatch(createNewWorkout(newWorkout));

        navigation.goBack();
      } catch (error) {
        console.error("OpenAI API error:", error);
      }
      console.log("completed");
    }
  };
  return (
    <View>
      <Text>AIWorkoutCreator</Text>
    </View>
  );
};

export default AIWorkoutCreator;
