import Attendance from "../models/attendanceModel.js";
import { ErrorHandler } from "../utils/error-handler.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import moment from "moment";
import User from "../models/userModel.js";
import { calculateGradeForDateRange } from "../utils/calculateGrades.js";

const markAttendance = catchAsyncError(async (req, res, next) => {
  const { status, leaveReason } = req.body;
  const userId = req.user._id;

  const today = moment().startOf("day");

  const attendanceMarked = await Attendance.findOne({
    user: userId,
    date: today.toDate(),
  });

  if (attendanceMarked) {
    return next(new ErrorHandler("Attendance Already Marked", 400));
  }
  const attendance = new Attendance({
    user: userId,
    date: today.toDate(),
    status,
    leaveReason,
  });

  await attendance.save();
  res.status(200).json({ success: true, message: "Attendance Marked" });
});

const getAllAttendance = catchAsyncError(async (req, res, next) => {
  const { from, to } = req.body;

  let attendances;

  if (from && to) {
    const startDate = moment(from).startOf("day").toDate();
    const endDate = moment(to).endOf("day").toDate();

    attendances = await Attendance.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("user");
  } else {
    attendances = await Attendance.find().populate("user");
  }

  res.status(200).json({ success: true, allAttendances: attendances });
});

const updateAttendance = catchAsyncError(async (req, res, next) => {
  const { status, leaveReason, leaveStatus } = req.body;
  const attendanceId = req.params.id;
  const attendance = await Attendance.findByIdAndUpdate(
    attendanceId,
    { status, leaveReason, leaveStatus },
    { new: true, runValidators: true }
  );

  if (!attendance) {
    return next(new ErrorHandler("Attendance not found", 404));
  }

  res.status(200).json({ success: true, message: "Attendance Updated" });
});

const deleteAttendance = catchAsyncError(async (req, res, next) => {
  const attendanceId = req.params.id;
  const attendance = await Attendance.findByIdAndDelete(attendanceId);
  if (!attendance) {
    return next(new ErrorHandler("Attendance not found", 404));
  }
  res.status(200).json({ success: true, message: "Attendance Deleted" });
});

const getUserAttendance = catchAsyncError(async (req, res, next) => {
  const { userId, from, to } = req.body;
  let attendances;
  let grade = null;

  if (from && to) {
    const startDate = moment(from).startOf("day").toDate();
    const endDate = moment(to).endOf("day").toDate();

    attendances = await Attendance.find({
      user: userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("user");

    const result = await calculateGradeForDateRange(userId, startDate, endDate);

    grade = result.grade;
  } else {
    attendances = await Attendance.find({ user: userId }).populate("user");
  }
  const presents = attendances.filter(
    (record) => record.status === "Present"
  ).length;
  const absents = attendances.filter(
    (record) => record.status === "Absent"
  ).length;
  const leaves = attendances.filter(
    (record) => record.status === "Leave"
  ).length;
  const totalDays = attendances.length;
  res.status(200).json({
    success: true,
    userAttendance: attendances,
    absents,
    totalDays,
    grade,
    leaves,
    presents,
  });
});

const getMyAttendance = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const attendances = await Attendance.find({ user: userId });
  const presents = attendances.filter(
    (record) => record.status === "Present"
  ).length;
  const absents = attendances.filter(
    (record) => record.status === "Absent"
  ).length;
  const leaves = attendances.filter(
    (record) => record.status === "Leave"
  ).length;

  res.status(200).json({
    success: true,
    myAttendances: attendances,
    presents: presents,
    absents: absents,
    leaves: leaves,
  });
});
const isAttendanceMarked = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  const todayStart = moment().startOf("day").toDate();
  const todayEnd = moment().endOf("day").toDate();

  const attendanceRecord = await Attendance.findOne({
    user: userId,
    date: { $gte: todayStart, $lte: todayEnd },
  });

  if (attendanceRecord) {
    return res.status(200).json({
      success: true,
      message: "Attendance has been marked for today.",
      attendance: attendanceRecord,
    });
  } else {
    return res.status(200).json({
      success: true,
      message: "Attendance has not been marked for today.",
    });
  }
});

// Get Attendance Controller

export const getAttendanceDetails = catchAsyncError(async (req, res, next) => {
  const attendanceId = req.params.id;
  const attendance = await Attendance.findById(attendanceId);
  if (!attendance) {
    return next(new ErrorHandler("Attendance not found", 404));
  }

  res.status(200).json({ success: true, attendanceDetailsData: attendance });
});
export default {
  markAttendance,
  getAllAttendance,
  updateAttendance,
  deleteAttendance,
  getUserAttendance,
  getMyAttendance,
  isAttendanceMarked,
  getAttendanceDetails,
};
