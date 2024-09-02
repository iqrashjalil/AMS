import logo from "../../assets/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { FaChevronRight, FaEdit } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdLogout, MdOutlineRemoveRedEye } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../../serverUrl";
import { logout } from "../../store/slices/userSlice";
const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/auth");
  };
  return (
    <div className="fixed flex flex-col w-[20%] justify-between h-screen border-r-2 border-slate-100">
      <div className="flex flex-col ">
        <img
          src={logo}
          className="w-[100%] border-b-2 border-slate-100 p-4"
          alt=""
        />

        <ul>
          <NavLink
            to={`${
              user?.role === "student" ? "/userdashboard" : "/admindashboard"
            }`}
            className="flex items-center justify-between p-4 transition-all duration-150 hover:bg-slate-100 text-primary"
          >
            <span className="flex items-center text-lg">
              <LuLayoutDashboard className="mr-2 text-2xl" /> Dashboard
            </span>
            <FaChevronRight />
          </NavLink>
          <NavLink
            to={`${user?.role === "student" ? "/viewattendance" : "/allusers"}`}
            className="flex items-center justify-between p-4 transition-all duration-150 hover:bg-slate-100 text-primary"
          >
            <span className="flex items-center text-lg">
              <MdOutlineRemoveRedEye className="mr-2 text-2xl" />
              {`${user?.role === "student" ? "View Attendance" : "All Users"}`}
            </span>
            <FaChevronRight />
          </NavLink>
          <NavLink
            to={`${
              user?.role === "student" ? "/markattendance" : "/allattendances"
            }`}
            className="flex items-center justify-between p-4 transition-all duration-150 hover:bg-slate-100 text-primary"
          >
            <span className="flex items-center text-lg">
              <FaRegCircleCheck className="mr-2 text-2xl" />{" "}
              {user?.role === "student"
                ? "Mark Attendance"
                : "All Attendance Record"}
            </span>
            <FaChevronRight />
          </NavLink>
        </ul>
      </div>
      <div className="flex items-center justify-between p-4 bg-slate-100">
        <span className="flex items-center gap-4">
          <img
            className="w-10 h-10 rounded-full"
            src={`${serverUrl}/${user?.profilePicture}`}
            alt=""
          />
          <p className="font-semibold text-primary">{user?.name}</p>
        </span>
        <span className="flex items-center gap-4">
          <FaEdit
            onClick={() => navigate(`/profile/${user?._id}`)}
            className="text-2xl cursor-pointer text-primary"
          />
          <MdLogout
            onClick={() => logoutHandler()}
            className="text-2xl text-red-600 cursor-pointer"
          />
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
