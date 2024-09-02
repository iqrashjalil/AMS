import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Auth from "./pages/auth/Auth";
import User_Dashboard from "./pages/user/User_Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./store/slices/userSlice";
import Mark_Attendance from "./pages/user/Mark_Attendance";
import Edit_Profile from "./pages/Edit_Profile";
import View_Attendance from "./pages/user/View_Attendance";
import Admin_Dashboard from "./pages/Admin/Admin_Dashboard";
import All_Users from "./pages/Admin/All_Users";
import All_Attendance from "./pages/Admin/All_Attendance";
import User_Attendance from "./pages/Admin/User_Attendance";
import Update_Attendance from "./pages/Admin/Update_Attendance";
// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const idAuthenticated = !!user;
  return idAuthenticated ? children : <Navigate to={"/auth"} />;
};

// eslint-disable-next-line react/prop-types
const AuthRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const idAuthenticated = !!user;
  return idAuthenticated ? (
    <Navigate
      to={`${user?.role === "student" ? "/userdashboard" : "/admindashboard"}`}
    />
  ) : (
    children
  );
};
function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthRoute>
                <Auth />
              </AuthRoute>
            }
          />
          <Route
            path="/userdashboard"
            element={
              <PrivateRoute>
                <User_Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/markattendance"
            element={
              <PrivateRoute>
                <Mark_Attendance />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <Edit_Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/viewattendance"
            element={
              <PrivateRoute>
                <View_Attendance />
              </PrivateRoute>
            }
          />

          <Route
            path="/admindashboard"
            element={
              <PrivateRoute>
                <Admin_Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/allusers"
            element={
              <PrivateRoute>
                <All_Users />
              </PrivateRoute>
            }
          />

          <Route
            path="/allattendances"
            element={
              <PrivateRoute>
                <All_Attendance />
              </PrivateRoute>
            }
          />
          <Route
            path="/userattendance/:id"
            element={
              <PrivateRoute>
                <User_Attendance />
              </PrivateRoute>
            }
          />

          <Route
            path="/updateattendance/:id"
            element={
              <PrivateRoute>
                <Update_Attendance />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to={"/auth"} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
