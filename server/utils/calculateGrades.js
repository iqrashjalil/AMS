import moment from "moment";
import Attendance from "../models/attendanceModel.js"; // Make sure to import your Attendance model

export const calculateGradeForDateRange = async (
  userId,
  startDate,
  endDate
) => {
  const start = moment(startDate).startOf("day").toDate();
  const today = moment().endOf("day").toDate();
  const end = moment(endDate).endOf("day").isBefore(today)
    ? moment(endDate).endOf("day").toDate()
    : today;

  // Fetch all attendance records for the user within the date range
  const attendanceRecords = await Attendance.find({
    user: userId,
    date: { $gte: start, $lte: end },
    status: { $in: ["Present", "Absent"] }, // Consider only Present and Absent
  });

  const presentDaysCount = attendanceRecords.filter(
    (record) => record.status === "Present"
  ).length;

  const totalDays = attendanceRecords.length; // Only count days with attendance

  // Calculate the percentage of present days
  const presentPercentage = (presentDaysCount / totalDays) * 100;

  // Assign grade based on the percentage of present days
  let grade;
  if (presentPercentage >= 90) {
    grade = "A";
  } else if (presentPercentage >= 80) {
    grade = "B";
  } else if (presentPercentage >= 70) {
    grade = "C";
  } else if (presentPercentage >= 60) {
    grade = "D";
  } else {
    grade = "F";
  }

  return { grade, presentDaysCount, totalDays, presentPercentage };
};
