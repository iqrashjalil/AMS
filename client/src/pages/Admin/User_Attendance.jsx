import { useEffect, useState } from "react";
import Sidebar from "../../component/sidebar/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getUserAttendance } from "../../store/slices/attendanceSlice";
import { useNavigate, useParams } from "react-router-dom";

const User_Attendance = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    totalAbsent,
    totalPresent,
    totalLeaves,
    gradesDetails,
    userAttendanceRecords,
  } = useSelector((state) => state.attendance);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const dateRange = {
      userId: id,
      from: "",
      to: "",
    };
    dispatch(getUserAttendance(dateRange));
  }, [dispatch, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dateRange = {
      userId: id,
      from: fromDate,
      to: toDate,
    };
    dispatch(getUserAttendance(dateRange));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="flex w-full">
      <div className="hidden w-[20%] sm:block">
        <Sidebar />
      </div>
      <div className="sm:w-[80%] w-full p-2">
        <div className="flex items-center justify-center">
          <h1 className="mb-4 text-4xl font-bold text-primary">
            All Attendances
          </h1>
        </div>
        <form
          className="flex items-center w-full justify-center gap-[2%] mb-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col w-[40%]">
            <label htmlFor="from">From</label>
            <input
              className="w-full p-3 border-2 outline-none border-slate-200 focus:border-slate-700"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-[40%]">
            <label htmlFor="to">To</label>
            <input
              className="w-full p-3 border-2 rounded outline-none border-slate-200 focus:border-slate-700"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="">.</label>
            <button
              className="p-4 text-white rounded hover:bg-[#1b2227] transition-all duration-150 bg-primary"
              type="submit"
            >
              Fetch
            </button>
          </div>
        </form>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Leave Reason
                </th>
                <th scope="col" className="px-6 py-3">
                  Leave Status
                </th>
              </tr>
            </thead>
            <tbody>
              {userAttendanceRecords?.map((attendance, index) => (
                <tr
                  onClick={() =>
                    navigate(`/updateattendance/${attendance._id}`)
                  }
                  key={index}
                  className="bg-white border-b cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {attendance.user.name}
                  </td>
                  <th scope="row" className="px-6 py-4 ">
                    {formatDate(attendance.date)}
                  </th>
                  <td className="px-6 py-4">
                    <span
                      className={`${
                        attendance.status === "Present"
                          ? "text-green-800 bg-green-100 dark:bg-gray-700 dark:text-green-400 border border-green-400"
                          : `${
                              attendance.status === "Absent"
                                ? "dark:bg-gray-700 dark:text-red-400 border border-red-400 bg-red-100 text-red-800"
                                : "dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300 bg-yellow-100 text-yellow-800"
                            }`
                      }  text-xs font-medium me-2 px-2.5 py-0.5 rounded `}
                    >
                      {attendance.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {attendance.leaveReason
                      ? `${attendance.leaveReason}`
                      : "NiL"}
                  </td>
                  <td className="px-6 py-4">
                    {attendance.leaveStatus
                      ? `${attendance.leaveStatus}`
                      : "NiL"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between px-4">
            <span>
              Total Presents: <span>{totalPresent}</span>
            </span>

            <span>
              Total Absents: <span>{totalAbsent}</span>
            </span>

            <span>
              Total Leaves: <span>{totalLeaves}</span>
            </span>

            {gradesDetails && (
              <span>
                Total Grades: <span>{gradesDetails}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default User_Attendance;
