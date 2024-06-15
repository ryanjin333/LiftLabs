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
        workouts: [],
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
  reducers: {},
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
//export const {} = userSlice.actions;

export default userSlice.reducer;
