import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../component/sidebar/sidebar";
import {
  getAttendanceDetails,
  updateAttendance,
} from "../../store/slices/attendanceSlice"; // Import the updateAttendance action
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const Update_Attendance = () => {
  document.title = "AMS - Mark Attendance";
  const { id } = useParams();
  const [status, setStatus] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveStatus, setLeaveStatus] = useState(""); // Added leaveStatus state
  const dispatch = useDispatch();
  const { success, error, attendanceDetails } = useSelector(
    (state) => state.attendance
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const attendanceData = {
      id,
      status,
      leaveReason: status === "Leave" ? leaveReason : null,
      leaveStatus: status === "Leave" ? leaveStatus : null, // Include leaveStatus if applicable
    };

    dispatch(updateAttendance(attendanceData));

    setStatus("");
    setLeaveReason("");
    setLeaveStatus(""); // Clear the leaveStatus state after submission
  };

  useEffect(() => {
    if (success) {
      toast.success("Attendance Updated Successfully");
    }
    if (error) {
      toast.error(error);
    }
  }, [error, success]);

  useEffect(() => {
    dispatch(getAttendanceDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (attendanceDetails) {
      setStatus(attendanceDetails.status || "");
      setLeaveReason(attendanceDetails.leaveReason || "");
      setLeaveStatus(attendanceDetails.leaveStatus || "");
    }
  }, [attendanceDetails]);

  return (
    <>
      <section className="flex w-full">
        <div className="hidden w-[20%] sm:block">
          <Sidebar />
        </div>
        <div className="sm:w-[80%] h-screen flex flex-col items-center justify-center w-full p-2">
          <div className="border-2 p-2 border-slate-100 w-[500px]">
            <div className="flex justify-center">
              <h1 className="text-4xl font-extrabold font text-primary">
                Mark Your Attendance
              </h1>
            </div>
            <form className="w-full mt-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="status">Update Attendance Status</label>
                <select
                  className="w-full p-2 mb-4 border-2 bg-slate-100 border-slate-100"
                  name="status"
                  id="status"
                  value={status} // Bind to status state
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="">Select Attendance Status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">Leave</option>
                </select>
              </div>
              {status === "Leave" && (
                <>
                  <div>
                    <label htmlFor="leaveReason">Leave Reason</label>
                    <input
                      className="w-full p-2 mb-4 border-2 bg-slate-100 border-slate-100"
                      type="text"
                      name="leaveReason"
                      placeholder="Enter Leave Reason"
                      value={leaveReason} // Bind to leaveReason state
                      onChange={(e) => setLeaveReason(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="leaveStatus">Leave Status</label>
                    <select
                      className="w-full p-2 mb-4 border-2 bg-slate-100 border-slate-100"
                      name="leaveStatus"
                      id="leaveStatus"
                      value={leaveStatus} // Bind to leaveStatus state
                      onChange={(e) => setLeaveStatus(e.target.value)}
                      required
                    >
                      <option value="">Select Leave Status</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full p-2 mb-4 border-2 bg-slate-100 border-slate-100"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Update_Attendance;
