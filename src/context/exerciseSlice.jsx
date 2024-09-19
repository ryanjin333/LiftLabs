import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Firebase
import { updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Axios
import axios from "axios";

//ExerciseDB API options
const EXERCISE_DB_OPTIONS = {
  method: "GET",
  url: "https://workoutdb1.p.rapidapi.com/exercise/all",
  headers: {
    "x-rapidapi-key": "a31298262cmsh4165cf285213c1ep185e0bjsnc72489d39be3",
    "x-rapidapi-host": "workoutdb1.p.rapidapi.com",
  },
};

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  modalVisible: false,
  editModePlan: null,
  exerciseName: "",
  exerciseGIF: "",
  currentWorkout: { createdBy: "", id: "", image: "", plan: [], title: "" },
};

export const fetchPlan = createAsyncThunk("exercise/fetchPlan", async () => {
  // try {
  //   const workoutRef = doc(db, "users", auth.currentUser.uid);
  //   return workoutsSnap.data();
  // } catch (error) {
  //   console.error(error);
  // }
});

export const addAllExercisesToFirestore = createAsyncThunk(
  "exercise/addAllExercisesToFirestore",
  async (_, { getState }) => {
    try {
      const response = await axios.request(EXERCISE_DB_OPTIONS);

      const exerciseProperties = response.data.map((item) => {
        return {
          name: item.name,
          gif: item.gifUrl,
          mainMuscle: item.bodyPart,
          id: item.id,
        };
      });
      //console.log(exerciseProperties);

      await updateDoc(doc(db, "exercises", "allExercises"), {
        exercises: exerciseProperties,
      });
    } catch (error) {
      console.error(error);
    }
  }
);

export const createNewExercise = createAsyncThunk(
  "exercise/createNewExercise",
  async (newExercise, { getState }) => {
    try {
      const currentWorkout = getState().exercise.currentWorkout;
      const workouts = getState().workout.workouts;
      const localWorkout = {
        ...currentWorkout,
        plan: [...currentWorkout.plan, newExercise],
      };
      const newExerciseFirestore = {
        workouts: workouts.map((workout) => {
          if (workout.id === currentWorkout.id) {
            return {
              ...workout,
              plan: [...workout.plan, newExercise],
            };
          }
          return workout;
        }),
      };
      await updateDoc(
        doc(db, "users", auth.currentUser.uid),
        newExerciseFirestore
      );
      return localWorkout;
    } catch (error) {
      console.error(error);
    }
  }
);

export const editExercise = createAsyncThunk(
  "exercise/editExercise",
  async (updatedExercise, { getState }) => {
    try {
      const currentWorkout = getState().exercise.currentWorkout;
      const workouts = getState().workout.workouts;

      const localWorkout = {
        ...currentWorkout,
        plan: currentWorkout.plan.map((exercise) =>
          exercise.id === updatedExercise.id ? updatedExercise : exercise
        ),
      };

      const updatedWorkouts = workouts.map((workout) => {
        if (workout.id === currentWorkout.id) {
          return {
            ...workout,
            plan: workout.plan.map((exercise) =>
              exercise.id === updatedExercise.id ? updatedExercise : exercise
            ),
          };
        }
        return workout;
      });

      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        workouts: updatedWorkouts,
      });

      return localWorkout;
    } catch (error) {
      console.error("Error editing exercise: ", error);
    }
  }
);

export const deleteExercise = createAsyncThunk(
  "exercise/deleteExercise",
  async (exerciseId, { getState }) => {
    try {
      const currentWorkout = getState().exercise.currentWorkout;
      const workouts = getState().workout.workouts;
      const updatedWorkouts = workouts.map((workout) => {
        if (workout.id === currentWorkout.id) {
          return {
            ...workout,
            plan: workout.plan.filter((exercise) => exercise.id !== exerciseId),
          };
        }
        return workout;
      });

      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        workouts: updatedWorkouts,
      });

      const updatedCurrentWorkout = updatedWorkouts.find(
        (workout) => workout.id === currentWorkout.id
      );
      return updatedCurrentWorkout;
    } catch (error) {
      console.error("Error deleting exercise: ", error);
    }
  }
);

export const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    changeModalVisible(state, action) {
      state.modalVisible = action.payload;
    },
    changeExerciseName(state, action) {
      state.exerciseName = action.payload;
    },
    setExerciseGIF(state, action) {
      state.exerciseGIF = action.payload;
    },
    changeCurrentWorkout(state, action) {
      state.currentWorkout = action.payload;
    },
    setEditModePlan(state, action) {
      state.editModePlan = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetch plan
    builder.addCase(fetchPlan.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPlan.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(fetchPlan.rejected, (state, action) => {
      state.isLoading = false;
    });
    // create new exercise
    builder.addCase(createNewExercise.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(createNewExercise.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentWorkout = action.payload;
    });
    builder.addCase(createNewExercise.rejected, (state, action) => {
      state.isLoading = false;
    });
    // edit exercise
    builder.addCase(editExercise.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(editExercise.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentWorkout = action.payload;
    });
    builder.addCase(editExercise.rejected, (state, action) => {
      state.isLoading = false;
    });
    // delete exercise
    builder.addCase(deleteExercise.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(deleteExercise.fulfilled, (state, action) => {
      state.isLoading = false;

      state.currentWorkout = action.payload;
    });
    builder.addCase(deleteExercise.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  changeModalVisible,
  changeExerciseName,
  changeCurrentWorkout,
  setEditModePlan,
  setExerciseGIF,
} = exerciseSlice.actions;

export default exerciseSlice.reducer;
