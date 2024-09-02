import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import attendanceSlice from "./slices/attendanceSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    attendance: attendanceSlice,
  },
});

export default store;
