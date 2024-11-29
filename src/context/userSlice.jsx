import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Platform } from "react-native";
import uuid from "react-native-uuid";

// Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { showMessage } from "react-native-flash-message";

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  uid: null,
  username: "",
  fullName: "",
  weight: "lbs",
};

export const loadInfo = createAsyncThunk("user/loadInfo", async () => {
  try {
    const infoSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
    return infoSnap.data();
  } catch (error) {
    console.error(error);
  }
});

export const setInfo = createAsyncThunk(
  "user/setInfo",
  async ({ key, value }) => {
    try {
      const infoDoc = doc(db, "users", auth.currentUser.uid);
      await updateDoc(infoDoc, {
        [key]: value,
      });
      const infoSnap = await getDoc(infoDoc);
      return infoSnap.data();
    } catch (error) {
      console.error(error);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (currentUser) => {
    try {
      const { username, email, password, isEmailSignIn } = currentUser;

      if (isEmailSignIn) {
        await createUserWithEmailAndPassword(auth, email, password);
      }

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        username: username,
        fullName: "",
        pfp: "https://firebasestorage.googleapis.com/v0/b/gym-app-cf517.appspot.com/o/images%2Fpfp.png?alt=media&token=3e47b16b-99b0-43b6-ba18-d3b6370e783d",
        bio: "",
        os: Platform.OS,
        weight: "lbs",
        followers: [],
        following: [],
        email: email,
        workouts: [],
        sharedWorkouts: [],
        pendingWorkouts: [],
        days: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: [],
        },
        more: uuid.v4(),
      });
      // await setDoc(doc(db, "usersTest", auth.currentUser.uid), {
      //   username: username,
      //   fullName: "",
      //   pfp: "https://firebasestorage.googleapis.com/v0/b/gym-app-cf517.appspot.com/o/images%2Fpfp.png?alt=media&token=3e47b16b-99b0-43b6-ba18-d3b6370e783d",
      //   bio: "",
      //   os: Platform.OS,
      //   weight: "lbs",
      //   followers: [],
      //   following: [],
      //   email: email,
      //   workouts: [],
      //   sharedWorkouts: [],
      //   pendingWorkouts: [],
      //   more: uuid.v4(),
      // });
      return auth.currentUser.uid;
    } catch (error) {
      // display global alert
      let errorMessage = "An unexpected error occurred. Please try again.";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "The email address is already in use by another account.";
          break;
        case "auth/invalid-email":
          errorMessage = "The email address is badly formatted.";
          break;
        case "auth/weak-password":
          errorMessage = "The password is too weak.";
          break;
      }

      showMessage({
        message: errorMessage,
        type: "danger",
      });
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (currentUser) => {
    const { email, password, isEmailSignIn } = currentUser;
    try {
      if (isEmailSignIn) {
        await signInWithEmailAndPassword(auth, email, password);
      }
      return auth.currentUser.uid;
    } catch (error) {
      // display global alert
      let errorMessage = "An unexpected error occurred. Please try again.";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "The email address is badly formatted.";
          break;
        case "auth/user-not-found":
          errorMessage = "There is no user record corresponding to this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "The password is invalid.";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Access to this account has been temporarily disabled due to many failed login attempts.";
          break;
      }

      showMessage({
        message: errorMessage,
        type: "danger",
      });
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // load
    builder.addCase(loadInfo.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(loadInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.showAlert = true;
      state.username = action.payload.username;
      state.fullName = action.payload.fullName;
      state.weight = action.payload.weight;
      state.alertType = "success";
      state.alertText = "Data loaded";
    });
    builder.addCase(loadInfo.rejected, (state, action) => {
      state.isLoading = false;
      state.alertType = "danger";
      alertText = action.payload.msg;
    });
    // set info
    builder.addCase(setInfo.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(setInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.showAlert = true;
      state.username = action.payload.username;
      state.fullName = action.payload.fullName;
      state.weight = action.payload.weight;
      state.alertType = "success";
      state.alertText = "Data sent";
    });
    builder.addCase(setInfo.rejected, (state, action) => {
      state.isLoading = false;
      state.alertType = "danger";
      alertText = action.payload.msg;
    });
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
