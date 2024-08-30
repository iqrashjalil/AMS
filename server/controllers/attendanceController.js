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

  const startDate = moment(from).startOf("day").toDate();
  const endDate = moment(to).endOf("day").toDate();

  // Find attendances between 'from' and 'to' dates
  const attendances = await Attendance.find({
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).populate("user");

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
  if (!userId || !from || !to) {
    return next(new ErrorHandler("Please Enter All Fields", 400));
  }
  const startDate = moment(from).startOf("day").toDate();
  const endDate = moment(to).endOf("day").toDate();

  const attendances = await Attendance.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate },
  }).populate("user");
  const { grade, presentDaysCount, totalDays } =
    await calculateGradeForDateRange(userId, startDate, endDate);

  res.status(200).json({
    success: true,
    userAttendace: attendances,
    totalDays,
    presentDaysCount,
    grade,
  });
});

export default {
  markAttendance,
  getAllAttendance,
  updateAttendance,
  deleteAttendance,
  getUserAttendance,
};
