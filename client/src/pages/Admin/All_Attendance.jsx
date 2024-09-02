import { useEffect, useState } from "react";
import Sidebar from "../../component/sidebar/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getAllAttendance } from "../../store/slices/attendanceSlice";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import Loader from "../../component/loader/Loader";

const All_Attendance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { attendanceRecords, loading, totalAbsent, totalLeaves, totalPresent } =
    useSelector((state) => state.attendance);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    dispatch(getAllAttendance({ from: "", to: "" }));
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dateRange = {
      from: fromDate,
      to: toDate,
    };
    dispatch(getAllAttendance(dateRange));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDownload = async () => {
    const element = document.getElementById("downloadtable");
    const opt = {
      margin: 1,
      filename: "attendance-report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
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
              <table className="w-full mt-4 text-sm text-left text-gray-500 dark:text-gray-400">
                <tbody>
                  <tr>
                    <td className="px-4 py-2">Total Presents:</td>
                    <td className="px-4 py-2 font-bold">{totalPresent}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Total Absents:</td>
                    <td className="px-4 py-2 font-bold">{totalAbsent}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Total Leaves:</td>
                    <td className="px-4 py-2 font-bold">{totalLeaves}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <button
                className="p-4 mt-4 text-white rounded hover:bg-[#1b2227] transition-all duration-150 bg-primary"
                onClick={handleDownload}
              >
                Download Report
              </button>
            </div>{" "}
          </div>
        </section>
      )}
    </>
  );
};

export default All_Attendance;
