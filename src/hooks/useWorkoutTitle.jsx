import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { WorkoutHelpers } from "../helpers/general";

const useWorkoutTitle = (selectedDate) => {
  const workout = useSelector((state) => state.workout);
  const days = useSelector((state) => state.calendar.days);

  const allWorkouts = [
    ...(workout.workouts || []),
    ...(workout.sharedWorkouts || []),
  ];

  const [workoutTitle, setWorkoutTitle] = useState("None");

  useEffect(() => {
    const fetchWorkout = async () => {
      const day = days[selectedDate.toLowerCase()];
      try {
        if (day && day.length > 0) {
          const workout = await WorkoutHelpers.idToWorkout(day[0], allWorkouts);
          if (workout) {
            setWorkoutTitle(workout.title);
          } else {
            setWorkoutTitle("None");
          }
        } else {
          setWorkoutTitle("None");
        }
      } catch (error) {
        console.error("Error fetching workout:", error);
        setWorkoutTitle("None");
      }
    };

    fetchWorkout();
  }, [selectedDate, days, allWorkouts]);

  return workoutTitle;
};

export default useWorkoutTitle;
