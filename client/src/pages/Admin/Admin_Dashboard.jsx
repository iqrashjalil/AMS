import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../component/sidebar/sidebar";
import { useEffect } from "react";
import { getAllUsers } from "../../store/slices/userSlice";
import {
  getAllAttendance,
  getMyAttendances,
} from "../../store/slices/attendanceSlice";
import Loader from "../../component/loader/Loader";
import { useNavigate } from "react-router-dom";

const Admin_Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allUsers } = useSelector((state) => state.user);
  const { totalLeaves, attendanceRecords, loading } = useSelector(
    (state) => state.attendance
  );

  useEffect(() => {
    dispatch(getAllAttendance());
  }, [dispatch]);

  useEffect(() => {
    console.log("Checking");
    if (allUsers.length === 0) {
      dispatch(getAllUsers());
    }
  }, [allUsers.length, dispatch]);
  useEffect(() => {
    dispatch(getMyAttendances());
  }, [dispatch]);
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="flex w-full">
          <div className="hidden w-[20%] sm:block">
            <Sidebar />
          </div>
          <div className="sm:w-[80%] w-full p-2">
            <div className="flex items-center xl:gap-40 justify-center gap-20 border-b-2 h-[20rem] border-slate-100">
              <div className="flex flex-col items-center justify-center w-64 h-40 p-2 border-2 text-primary border-slate-100">
                <h1 className="flex text-xl font-bold">Total Users</h1>
                <span className="text-5xl font-extrabold">
                  {allUsers?.length}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center w-64 h-40 border-2 text-primary border-slate-100">
                <h1 className="text-xl font-bold">Leaves Requests</h1>
                <span className="text-5xl font-extrabold">{totalLeaves}</span>
              </div>
            </div>

            <div
              id="downloadtable"
              className="relative overflow-x-auto shadow-md sm:rounded-lg"
            >
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
                  {attendanceRecords?.map((attendance, index) => (
                    <tr
                      onClick={() =>
                        navigate(`/updateattendance/${attendance._id}`)
                      }
                      key={index}
                      className="bg-white border-b cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {attendance.user.name}
                      </th>
                      <th scope="row" className="px-6 py-4">
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
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Admin_Dashboard;
