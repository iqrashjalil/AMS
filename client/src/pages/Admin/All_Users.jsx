import { useEffect } from "react";
import Sidebar from "../../component/sidebar/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";

const All_Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allUsers } = useSelector((state) => state.user);

  useEffect(() => {
    console.log("Checking");
    if (allUsers.length === 0) {
      dispatch(getAllUsers());
    }
  }, [allUsers.length, dispatch]);
  return (
    <section className="flex w-full">
      <div className="hidden w-[20%] sm:block">
        <Sidebar />
      </div>
      <div className="sm:w-[80%] w-full p-2">
        <div className="flex items-center justify-center">
          <h1 className="mb-4 text-4xl font-bold text-primary">All Users</h1>
        </div>{" "}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Role
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {allUsers?.map((user, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {user.name}
                  </th>

                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`${
                        user.role === "student"
                          ? "text-green-800 bg-green-100 dark:bg-gray-700 dark:text-green-400 border border-green-400"
                          : "dark:bg-gray-700 dark:text-red-400 border border-red-400 bg-red-100 text-red-800"
                      }  text-xs font-medium me-2 px-2.5 py-0.5 rounded `}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/userattendance/${user._id}`)}
                      className="text-white bg-primary hover:bg-[#181f24] font-medium rounded text-sm px-4 py-2 text-center"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default All_Users;
