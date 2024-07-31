import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  loginScreenVisible: true,
  signupScreenVisible: true,
  homeScreenVisible: true,
  workoutScreenVisible: true,
  tabScreenVisible: true,
  focusScreenVisible: true,
  userScreenVisible: true,
};

// LOGIN TRANSITIONS

export const loginToSignupScreenTransition = createAsyncThunk(
  "animation/loginToSignupScreenTransition",
  async (_, { dispatch }) => {
    dispatch(animationSlice.actions.hideLoginScreen());
    await new Promise((resolve) => setTimeout(resolve, 750));
    dispatch(animationSlice.actions.showSignupScreen());
  }
);

export const loginToHomeScreenTransition = createAsyncThunk(
  "animation/loginToHomeScreenTransition",
  async (_, { dispatch }) => {
    dispatch(animationSlice.actions.hideLoginScreen());
    await new Promise((resolve) => setTimeout(resolve, 750));
    dispatch(animationSlice.actions.showHomeScreen());
    dispatch(animationSlice.actions.showUserScreen());
  }
);

// SIGNUP TRANSITIONS

export const signupToLoginScreenTransition = createAsyncThunk(
  "animation/signupToLoginScreenTransition",
  async (_, { dispatch }) => {
    dispatch(animationSlice.actions.hideSignupScreen());
    await new Promise((resolve) => setTimeout(resolve, 800));
    dispatch(animationSlice.actions.showLoginScreen());
  }
);

export const signupToHomeScreenTransition = createAsyncThunk(
  "animation/signupToHomeScreenTransition",
  async (_, { dispatch }) => {
    dispatch(animationSlice.actions.hideSignupScreen());
    await new Promise((resolve) => setTimeout(resolve, 800));
    dispatch(animationSlice.actions.showLoginScreen());
    dispatch(animationSlice.actions.showUserScreen());
  }
);

// HOME TRANSITIONS

export const homeToWorkoutScreenTransition = createAsyncThunk(
  "animation/homeToWorkoutScreenTransition",
  async (_, { dispatch }) => {
    dispatch(animationSlice.actions.hideHomeScreen());
    await new Promise((resolve) => setTimeout(resolve, 650));
    dispatch(animationSlice.actions.showWorkoutScreen());
  }
);

// WORKOUT TRANSITIONS

export const workoutToHomeScreenTransition = createAsyncThunk(
  "animation/workoutToHomeScreenTransition",
  async (_, { dispatch }) => {
    dispatch(animationSlice.actions.hideWorkoutScreen());
    await new Promise((resolve) => setTimeout(resolve, 750));
    dispatch(animationSlice.actions.showHomeScreen());
  }
);

export const workoutToFocusScreenTransition = createAsyncThunk(
  "animation/workoutToFocusScreenTransition",
  async (_, { dispatch }) => {
    dispatch(animationSlice.actions.hideWorkoutScreen());
    await new Promise((resolve) => setTimeout(resolve, 750));
    dispatch(animationSlice.actions.showFocusScreen());
  }
);

// FOCUS TRANSITIONS

export const focusToWorkoutScreenTransition = createAsyncThunk(
  "animation/focusToWorkoutScreenTransition",
  async (_, { dispatch }) => {
    dispatch(animationSlice.actions.hideFocusScreen());
    await new Promise((resolve) => setTimeout(resolve, 850));
    dispatch(animationSlice.actions.showWorkoutScreen());
  }
);

// focus to home screen transition

// USER TRANSITIONS

export const userToLoginScreenTransition = createAsyncThunk(
  "animation/userToLoginScreenTransition",
  async (_, { dispatch }) => {
    dispatch(animationSlice.actions.hideUserScreen());
    await new Promise((resolve) => setTimeout(resolve, 800));
    dispatch(animationSlice.actions.showLoginScreen());
  }
);

// Create the slice
const animationSlice = createSlice({
  name: "animation",
  initialState,
  reducers: {
    // LOGIN
    showLoginScreen(state) {
      state.loginScreenVisible = true;
    },
    hideLoginScreen(state) {
      state.loginScreenVisible = false;
    },
    // SIGNUP
    showSignupScreen(state) {
      state.signupScreenVisible = true;
    },
    hideSignupScreen(state) {
      state.signupScreenVisible = false;
    },
    // WORKOUT
    showWorkoutScreen(state) {
      state.workoutScreenVisible = true;
    },
    hideWorkoutScreen(state) {
      state.workoutScreenVisible = false;
    },
    // HOME
    showHomeScreen(state) {
      state.tabScreenVisible = true;
      state.homeScreenVisible = true;
    },
    hideHomeScreen(state) {
      state.homeScreenVisible = false;
      state.tabScreenVisible = false;
    },
    // FOCUS
    showFocusScreen(state) {
      state.focusScreenVisible = true;
    },
    hideFocusScreen(state) {
      state.focusScreenVisible = false;
    },
    // USER
    showUserScreen(state) {
      state.userScreenVisible = true;
    },
    hideUserScreen(state) {
      state.tabScreenVisible = false;
      state.userScreenVisible = false;
    },
  },
});

//export const {  } = animationSlice.actions;

export default animationSlice.reducer;
