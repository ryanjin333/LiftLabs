import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  uid: null,
};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (currentUser) => {
    try {
      const { username, email, password } = currentUser;
      await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        username: username,
        email: email,
        workouts: [
          {
            id: "4324325",
            title: "Chest",
            image: require("../assets/React_Native_Logo.png"),
            plan: [
              {
                title: "Dumbbell Chest Press",
                sets: 3,
                weight: 55,
                reps: 8,
                id: "1",
              },
              {
                title: "Dumbbell Incline Chest Press",
                sets: 3,
                weight: 45,
                reps: 8,
                id: "2",
              },
            ],
            createdBy: "uid",
          },
          {
            id: "42354345245",
            title: "Arms",
            image: require("../assets/React_Native_Logo.png"),
            plan: [
              {
                title: "Bicep curls",
                sets: 3,
                weight: 30,
                reps: 8,
                id: "3",
              },
            ],
            createdBy: "uid",
          },
          {
            id: "432425233442",
            title: "Shoulders",
            image: require("../assets/React_Native_Logo.png"),
            plan: [
              {
                title: "Shoulder Press",
                sets: 3,
                weight: 40,
                reps: 8,
                id: "4",
              },
              {
                title: "Overhead Shoulder Press",
                sets: 3,
                weight: 45,
                reps: 8,
                id: "5",
              },
              {
                title: "Machine Shoulder Press",
                sets: 3,
                weight: 120,
                reps: 8,
                id: "6",
              },
            ],
            createdBy: "uid",
          },
        ],
        sharedWorkouts: [],
      });
      return auth.currentUser.uid;
    } catch (error) {
      console.log("the error is:", error);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (currentUser) => {
    const { email, password } = currentUser;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return auth.currentUser.uid;
    } catch (error) {
      console.log(error);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
  extraReducers: (builder) => {
    // register
    builder.addCase(registerUser.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.showAlert = true;
      state.uid = action.payload;
      state.alertType = "success";
      state.alertText = "User Created! Redirecting...";
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.alertType = "danger";
      alertText = action.payload.msg;
    });
    // login
    builder.addCase(loginUser.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.showAlert = true;
      state.uid = action.payload;
      state.alertType = "success";
      state.alertText = "Login Successful! Redirecting...";
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.alertType = "danger";
      alertText = action.payload.msg;
    });
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = userSlice.actions;

export default userSlice.reducer;
