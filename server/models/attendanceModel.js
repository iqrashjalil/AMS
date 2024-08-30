import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Leave"],
  },
  leaveReason: {
    type: String,
    required: function () {
      return this.status === "Leave";
    },
  },
  leaveStatus: {
    type: String,
    default: function () {
      return this.status === "Leave" ? "Pending" : undefined;
    },
  },
});

attendanceSchema.pre("save", function (next) {
  if (this.status === "Leave") {
    this.leaveStatus = "Pending";
  }
  next();
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
