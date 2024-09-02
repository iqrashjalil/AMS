import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { serverUrl } from "../../serverUrl";
const initialState = {
  loading: false,
  error: null,
  success: false,
  myAttendance: null,
  attendanceRecords: [],
  userAttendanceRecords: [],
  attendanceDetails: null,
  gradesDetails: null,
  totalPresent: null,
  totalAbsent: null,
  totalLeaves: null,
};

export const getMyAttendances = createAsyncThunk(
  "attendance/getMyAttendances",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${serverUrl}/api/attendance/getmyattendance`,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const markAttendance = createAsyncThunk(
  "attendance/markattendance",
  async (formdata, { rejectWithValue }) => {
    try {
      const config = {
        Headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${serverUrl}/api/attendance/markattendance`,
        formdata,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getAllAttendance = createAsyncThunk(
  "attendance/getAllAttendance",
  async (dateRange, { rejectWithValue }) => {
    try {
      const config = {
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${serverUrl}/api/attendance/getallattendance`,
        dateRange,
        config
      );
      console.log("Response From Response", data);

      return data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getUserAttendance = createAsyncThunk(
  "attendance/getUserAttendance",
  async (dateRange, { rejectWithValue }) => {
    try {
      console.log(dateRange);

      const config = {
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${serverUrl}/api/attendance/getuserattendance`,
        dateRange,
        config
      );

      return data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateAttendance = createAsyncThunk(
  "attendance/updateAttendance",
  async (attendanceData, { rejectWithValue }) => {
    try {
      const config = {
        withCredentials: true,
      };
      const { data } = await axios.patch(
        `${serverUrl}/api/attendance/updateattendance/${attendanceData.id}`,
        attendanceData,
        config
      );

      return data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error.response.data.message);
    }
  }
);

// Get Attendance Details
export const getAttendanceDetails = createAsyncThunk(
  "attendance/getAttendanceDetails",
  async (id, { rejectWithValue }) => {
    try {
      const config = {
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${serverUrl}/api/attendance/getattendancedetails/${id}`,

        config
      );

      return data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error.response.data.message);
    }
  }
);

const attendanceSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetSuccess(state) {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //Get My Attendances Cases
      .addCase(getMyAttendances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyAttendances.fulfilled, (state, action) => {
        state.loading = false;
        state.myAttendance = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(getMyAttendances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Mark Attendance Cases
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //All Attendances Cases
      .addCase(getAllAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.attendanceRecords = action.payload.allAttendances;
      })
      .addCase(getAllAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //User Attendances Cases
      .addCase(getUserAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userAttendanceRecords = action.payload.userAttendance;
        state.totalAbsent = action.payload.absents;
        state.totalLeaves = action.payload.leaves;
        state.totalPresent = action.payload.presents;
        state.gradesDetails = action.payload.grade;
      })
      .addCase(getUserAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Get Attendances Details Cases
      .addCase(getAttendanceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.attendanceDetails = action.payload.attendanceDetailsData;
      })
      .addCase(getAttendanceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSuccess } = attendanceSlice.actions;
export default attendanceSlice.reducer;
