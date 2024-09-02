import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../component/sidebar/sidebar";
import { serverUrl } from "../serverUrl";
import { updateProfile } from "../store/slices/userSlice";
import Loader from "../component/loader/Loader";

const Edit_Profile = () => {
  document.title = "AMS - Edit Profile";
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "student",
    profilePicture: null,
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      setFormData({ ...formData, profilePicture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    updatedData.append("name", formData.name);
    updatedData.append("email", formData.email);
    updatedData.append("role", formData.role);
    if (formData.profilePicture) {
      updatedData.append("profilePicture", formData.profilePicture);
    }
    if (formData.password) {
      updatedData.append("password", formData.password);
    }
    dispatch(updateProfile(updatedData));
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
          <div className="sm:w-[80%] h-screen flex flex-col items-center justify-center w-full p-2">
            <div className="border-2 p-2 border-slate-100 w-[500px]">
              <div className="flex justify-center">
                <img
                  className="w-[200px] h-[200px] rounded-full"
                  src={`${serverUrl}/${user?.profilePicture}`}
                  alt="Profile"
                />
              </div>
              <form className="w-full mt-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    className="w-full p-2 mb-4 border-2 bg-slate-100 border-slate-100"
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Enter Name Here"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    className="w-full p-2 mb-4 border-2 bg-slate-100 border-slate-100"
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter Email Here"
                    onChange={handleChange}
                  />
                </div>
                {user?.role === "admin" && (
                  <div>
                    <label htmlFor="role">Role</label>
                    <select
                      className="w-full p-2 mb-4 border-2 bg-slate-100 border-slate-100"
                      name="role"
                      id="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="profilePicture">Profile Picture</label>
                  <input
                    className="w-full p-2 mb-4 border-2 bg-slate-100 border-slate-100"
                    type="file"
                    name="profilePicture"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <input
                    className="w-full p-2 mb-4 border-2 bg-slate-100 border-slate-100"
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="Enter New Password"
                    onChange={handleChange}
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
      )}
    </>
  );
};

export default Edit_Profile;
