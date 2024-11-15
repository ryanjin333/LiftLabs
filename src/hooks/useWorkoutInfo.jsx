import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { WorkoutHelpers } from "../helpers/general";

const useWorkoutInfo = (selectedDate) => {
  const workout = useSelector((state) => state.workout);
  const days = useSelector((state) => state.calendar.days);

  // Memoize allWorkouts to prevent unnecessary recalculation on every render
  const allWorkouts = useMemo(() => {
    return [...(workout.workouts || []), ...(workout.sharedWorkouts || [])];
  }, [workout.workouts, workout.sharedWorkouts]);

  const [workoutInfo, setWorkoutInfo] = useState({});

  useEffect(() => {
    const fetchWorkout = async () => {
      const day = days[selectedDate.toLowerCase()];
      try {
        if (day && day.length > 0) {
          const workout = await WorkoutHelpers.idToWorkout(day[0], allWorkouts);
          if (workout) {
            setWorkoutInfo(workout);
          } else {
            setWorkoutInfo({});
          }
        } else {
          setWorkoutInfo({});
        }
      } catch (error) {
        console.error("Error fetching workout:", error);
        setWorkoutInfo({});
      }
    };

    fetchWorkout();
  }, [selectedDate, days, allWorkouts]); // Ensure that dependencies are minimal

  return workoutInfo;
};

export default useWorkoutInfo;
