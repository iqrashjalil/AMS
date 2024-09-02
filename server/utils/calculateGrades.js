import moment from "moment";
import Attendance from "../models/attendanceModel.js";

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

  const attendanceRecords = await Attendance.find({
    user: userId,
    date: { $gte: start, $lte: end },
    status: { $in: ["Present", "Absent"] },
  });

  const presentDaysCount = attendanceRecords.filter(
    (record) => record.status === "Present"
  ).length;

  const totalDays = attendanceRecords.length;

  const presentPercentage = (presentDaysCount / totalDays) * 100;

  let grade;
  if (presentPercentage >= 90) {
    grade = "A";
  } else if (presentPercentage >= 80) {
    grade = "B";
  } else if (presentPercentage >= 70) {
    grade = "C";
  } else if (presentPercentage >= 50) {
    grade = "D";
  } else {
    grade = "F";
  }

  return { grade, presentDaysCount, totalDays, presentPercentage };
};
