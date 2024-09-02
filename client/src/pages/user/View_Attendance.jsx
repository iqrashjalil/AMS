import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../component/sidebar/sidebar";
import { useEffect } from "react";
import {
  getMyAttendances,
  resetSuccess,
} from "../../store/slices/attendanceSlice";
import Loader from "../../component/loader/Loader";

const View_Attendance = () => {
  document.title = "AMS - View Attendance";
  const dispatch = useDispatch();
  const { myAttendance, loading, success } = useSelector(
    (state) => state.attendance
  );

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
  useEffect(() => {
    if (success) {
      // Reset the success state after myAttendance is updated
      dispatch(resetSuccess());
    }
  }, [dispatch, myAttendance, success]);
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
            <div className="flex items-center justify-center">
              <h1 className="mb-4 text-4xl font-bold text-primary">
                My Attendances
              </h1>
            </div>{" "}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
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
                  {myAttendance?.myAttendances?.map((attendance, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
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

export default View_Attendance;
