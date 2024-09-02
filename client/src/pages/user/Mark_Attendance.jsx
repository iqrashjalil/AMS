import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../component/sidebar/sidebar";
import { markAttendance } from "../../store/slices/attendanceSlice";
import { toast } from "react-toastify";
const Mark_Attendance = () => {
  document.title = "AMS - Mark Attendance";
  const [status, setStatus] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const dispatch = useDispatch();
  const { success, error } = useSelector((state) => state.attendance);

  const handleSubmit = (e) => {
    e.preventDefault();

    const attendanceData = {
      status,
      leaveReason: status === "Leave" ? leaveReason : null,
    };

    dispatch(markAttendance(attendanceData));

    setStatus("");
    setLeaveReason("");
  };
  useEffect(() => {
    if (success) {
      toast.success("Attendance Marked Successfully");
    }
    if (error) {
      toast.error(error);
    }
  }, [error, success]);
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
                <label htmlFor="status">Attendance Status</label>
                <select
                  className="w-full p-2 mb-4 border-2 bg-slate-100 border-slate-100"
                  name="status"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="">Select Attendance Status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">Leave</option>
                </select>
              </div>
              <div>
                <label htmlFor="leaveReason">Leave Reason</label>
                <input
                  disabled={status !== "Leave"}
                  className="w-full p-2 mb-4 border-2 bg-slate-100 border-slate-100"
                  type="text"
                  name="leaveReason"
                  placeholder="Enter Leave Reason"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  required={status === "Leave"}
                />
              </div>

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

export default Mark_Attendance;
