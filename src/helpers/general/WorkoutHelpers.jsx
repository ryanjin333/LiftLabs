import { auth, db } from "../../config/firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";

// Turns an ID into a workout
const idToWorkout = async (id, allWorkouts) => {
  try {
    // Find the workout with the specified ID

    const workout = allWorkouts.find((workout) => workout.id === id);

    return workout;
  } catch (error) {
    console.debug("Non-critical error in idToWorkout:", error.message);
    return null;
  }
};

async function addDaysToAllUsers() {
  try {
    // Reference to the "users" collection
    const usersCollectionRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollectionRef);

    if (usersSnapshot.empty) {
      console.log("No users found!");
      return;
    }

    // Iterate through each user document
    const updates = usersSnapshot.docs.map(async (userDoc) => {
      const userRef = doc(db, "users", userDoc.id);

      // Add or update the `days` object
      await updateDoc(userRef, {
        days: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: [],
        },
      });

      console.log(`Days added for user: ${userDoc.id}`);
    });

    await Promise.all(updates); // Ensure all updates are completed
    console.log("Days object added to all users.");
  } catch (error) {
    console.error("Error updating users:", error);
  }
}

const WorkoutHelpers = { idToWorkout, addDaysToAllUsers };
export default WorkoutHelpers;
