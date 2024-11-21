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

  const defaultTitle = "Go to user";
  const [workoutTitle, setWorkoutTitle] = useState(defaultTitle);

  useEffect(() => {
    const fetchWorkout = async () => {
      const day = days[selectedDate.toLowerCase()];
      try {
        if (day && day.length > 0) {
          if (day[0] == "rest") {
            setWorkoutTitle("Rest");
          } else {
            const workout = await WorkoutHelpers.idToWorkout(
              day[0],
              allWorkouts
            );
            if (workout) {
              setWorkoutTitle(workout.title);
            } else {
              setWorkoutTitle(defaultTitle);
            }
          }
        } else {
          setWorkoutTitle(defaultTitle);
        }
      } catch (error) {
        console.error("Error fetching workout:", error);
        setWorkoutTitle(defaultTitle);
      }
    };

    fetchWorkout();
  }, [selectedDate, days, allWorkouts]);

  return workoutTitle;
};

export default useWorkoutTitle;
