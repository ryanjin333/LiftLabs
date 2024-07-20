import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Firebase
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import firebase from "firebase/app";
import "firebase/firestore";

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  workouts: [],
  sharedWorkouts: [],
  pendingWorkouts: [],
  dropdownTitle: "All",
  modalVisible: false,
  modalMode: "add",
  editModeWorkout: null,
};

export const fetchWorkouts = createAsyncThunk(
  "workout/fetchWorkouts",
  async (userData) => {
    try {
      return userData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const createNewWorkout = createAsyncThunk(
  "workout/createNewWorkout",
  async (newWorkout) => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        workouts: arrayUnion(newWorkout),
      });
    } catch (error) {
      console.error(error);
    }
  }
);
// adds a pending workout to a shared workout
export const addWorkout = createAsyncThunk(
  "workout/addWorkout",
  async (workout) => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        sharedWorkouts: arrayUnion(workout),
      });
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        pendingWorkouts: arrayRemove(workout),
      });
    } catch (error) {
      console.error(error);
    }
  }
);

export const editWorkout = createAsyncThunk(
  "workout/editWorkout",
  async (updatedWorkout) => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      const updatedWorkouts = userData.workouts.map((workout) =>
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      );

      await updateDoc(userDocRef, { workouts: updatedWorkouts });
    } catch (error) {
      console.error(error);
    }
  }
);

export const deleteWorkout = createAsyncThunk(
  "workout/deleteWorkout",
  async (workout) => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        workouts: arrayRemove(workout),
        sharedWorkouts: arrayRemove(workout),
      });
    } catch (error) {
      console.error(error);
    }
  }
);

// export const getUsername = createAsyncThunk(
//   "workout/getUsername",
//   async (uid) => {
//     try {
//       const usernameSnap = await getDoc(doc(db, "users", uid));
//       return usernameSnap.data().username;
//     } catch (error) {
//       console.error(error);
//     }
//   }
// );

export const sendWorkout = createAsyncThunk(
  "workout/sendWorkout",
  async ({ newWorkout, uid }) => {
    try {
      const sendWorkoutFirestore = {
        pendingWorkouts: arrayUnion(newWorkout),
      };
      await updateDoc(doc(db, "users", uid), sendWorkoutFirestore);
    } catch (error) {
      console.error(error);
    }
  }
);

export const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    changeDropdownTitle(state, action) {
      state.dropdownTitle = action.payload;
    },
    changeModalVisible(state, action) {
      state.modalVisible = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action;
    },
    setModalMode(state, action) {
      state.modalMode = action;
    },
    setEditModeWorkout(state, action) {
      state.editModeWorkout = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetch workouts
    builder.addCase(fetchWorkouts.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchWorkouts.fulfilled, (state, action) => {
      state.workouts = action.payload.workouts;
      state.sharedWorkouts = action.payload.sharedWorkouts;
      state.pendingWorkouts = action.payload.pendingWorkouts;
      state.isLoading = false;
    });
    builder.addCase(fetchWorkouts.rejected, (state, action) => {
      state.isLoading = false;
    });
    // create new workout
    builder.addCase(createNewWorkout.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(createNewWorkout.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(createNewWorkout.rejected, (state, action) => {
      state.isLoading = false;
    });
    // // get username
    // builder.addCase(getUsername.pending, (state, action) => {
    //   state.isLoading = true;
    // });
    // builder.addCase(getUsername.fulfilled, (state, action) => {
    //   state.isLoading = false;
    // });
    // builder.addCase(getUsername.rejected, (state, action) => {
    //   state.isLoading = false;
    // });
    // delete workout
    builder.addCase(deleteWorkout.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(deleteWorkout.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(deleteWorkout.rejected, (state, action) => {
      state.isLoading = false;
    });
    // send workout
    builder.addCase(sendWorkout.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(sendWorkout.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(sendWorkout.rejected, (state, action) => {
      state.isLoading = false;
    });
    // add workout
    builder.addCase(addWorkout.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(addWorkout.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(addWorkout.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  changeDropdownTitle,
  changeModalVisible,
  setIsLoading,
  setEditModeWorkout,
} = workoutSlice.actions;

export default workoutSlice.reducer;
