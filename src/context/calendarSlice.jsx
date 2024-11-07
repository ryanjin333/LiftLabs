import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDate: "",
  days: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  },
};

export const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
  },
});

export const { setSelectedDate } = calendarSlice.actions;

export default calendarSlice.reducer;
