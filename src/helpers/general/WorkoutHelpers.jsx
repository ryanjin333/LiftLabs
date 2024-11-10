import { auth, db } from "../../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// turns an id into a workout
const idToWorkout = async (id) => {
  try {
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();

    // Combine workouts and sharedWorkouts into one array
    const allWorkouts = [
      ...(userData.workouts || []),
      ...(userData.sharedWorkouts || []),
    ];

    // Find the workout with the specified ID
    const workout = allWorkouts.find((workout) => workout.id === id);

    return workout;
  } catch (error) {
    console.error(error);
  }
};

const WorkoutHelpers = { idToWorkout };
export default WorkoutHelpers;
