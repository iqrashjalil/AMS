import { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  register,
  resetSuccess,
} from "../../store/slices/userSlice.jsx";
import { toast } from "react-toastify";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, success, user } = useSelector((state) => state.user);
  const [registerSwitch, setRegisterSwitch] = useState(false);
  const [loginSwitch, setLoginSwitch] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [passwordHidden, setPasswordHidded] = useState(true);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      navigate(
        `${user?.role === "student" ? "/userdashboard" : "/admindashboard"}`
      );
      dispatch(resetSuccess());
    }
  }, [dispatch, error, navigate, success, user?.role]);

  const submitRegister = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", e.target.name.value);
    formData.append("email", e.target.email.value);
    formData.append("profilePicture", e.target.profilePicture.files[0]);
    formData.append("password", e.target.password.value);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    dispatch(register(formData));
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("email", e.target.email.value);
    formData.append("password", e.target.password.value);
    dispatch(login(formData));
  };
  const switchToRegister = () => {
    if (!registerSwitch) {
      setAnimating(true);
      setTimeout(() => {
        setRegisterSwitch(true);
        setLoginSwitch(false);
        setAnimating(false);
      }, 100);
    }
  };

  const switchToLogin = () => {
    if (!loginSwitch) {
      setAnimating(true);
      setTimeout(() => {
        setRegisterSwitch(false);
        setLoginSwitch(true);
        setAnimating(false);
      }, 100);
    }
  };

  const eyeClick = () => {
    setPasswordHidded(!passwordHidden);
  };

  return (
    <>
      <section className="flex items-center justify-center w-screen h-screen">
        <div className="flex flex-col items-center justify-center w-4/5 p-5 border-2 shadow-md h-4/5 md:p-10 border-slate-100 lg:p-15 xl:p-20 rounded-2xl md:w-3/5 lg:w-2/5">
          <div className="flex flex-col items-center w-full h-fit md:p-4">
            <img src={logo} alt="" />
          </div>
          <div className="w-full">
            <button
              onClick={switchToLogin}
              className={`w-2/4 p-2 border-b-2 ${
                loginSwitch ? "border-slate-700" : "border-slate-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={switchToRegister}
              className={`w-2/4 p-2 border-b-2 ${
                registerSwitch ? "border-slate-700" : "border-slate-200"
              }`}
            >
              Register
            </button>
          </div>
          <div className="relative w-full h-full overflow-hidden">
            <div className="relative w-full h-full">
              {/* Login Form */}
              <form
                onSubmit={loginSubmit}
                className={`absolute w-full transition-transform duration-500 ease-in-out ${
                  loginSwitch && !animating
                    ? "translate-x-0"
                    : loginSwitch && animating
                    ? "-translate-x-full"
                    : "-translate-x-full"
                }`}
              >
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  className="w-full p-3 mt-4 border-2 rounded-full outline-none border-slate-200 focus:border-slate-700"
                />
                <div className="relative">
                  <input
                    type={`${passwordHidden ? "password" : "text"}`}
                    placeholder="Password"
                    name="password"
                    className="w-full p-3 mt-4 border-2 rounded-full outline-none border-slate-200 focus:border-slate-700"
                  />
                  <FaRegEye
                    onClick={eyeClick}
                    className={`absolute ${
                      passwordHidden ? "" : "hidden"
                    } top-8 text-2xl cursor-pointer right-5`}
                  />
                  <FaRegEyeSlash
                    onClick={eyeClick}
                    className={`absolute ${
                      passwordHidden ? "hidden" : ""
                    } top-8 text-2xl cursor-pointer right-5`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center p-4 h-[58px] mt-4 border-b-2 rounded-full border-slate-200 bg-slate-700 text-white active:border-slate-800 hover:bg-slate-800"
                >
                  {loading ? (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

              {/* Register Form */}
              <form
                onSubmit={submitRegister}
                className={`absolute w-full transition-transform duration-500 ease-in-out ${
                  registerSwitch && !animating
                    ? "translate-x-0"
                    : registerSwitch && animating
                    ? "translate-x-full"
                    : "translate-x-full"
                }`}
              >
                <div className="flex gap-[5%]">
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Full Name"
                    className="w-full p-3 mt-4 border-2 rounded-full outline-none border-slate-200 focus:border-slate-700"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email Here"
                  className="w-full p-3 mt-4 border-2 rounded-full outline-none border-slate-200 focus:border-slate-700"
                />
                <input
                  type="file"
                  name="profilePicture"
                  className="w-full p-3 mt-4 border-2 rounded-full outline-none border-slate-200 focus:border-slate-700"
                />
                <div className="relative">
                  <input
                    type={`${passwordHidden ? "password" : "text"}`}
                    placeholder="Enter Password Here"
                    name="password"
                    className="w-full p-3 mt-4 border-2 rounded-full outline-none border-slate-200 focus:border-slate-700"
                  />
                  <FaRegEye
                    onClick={eyeClick}
                    className={`absolute ${
                      passwordHidden ? "" : "hidden"
                    } top-8 text-2xl cursor-pointer right-5`}
                  />
                  <FaRegEyeSlash
                    onClick={eyeClick}
                    className={`absolute ${
                      passwordHidden ? "hidden" : ""
                    } top-8 text-2xl cursor-pointer right-5`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center p-4 h-[58px] mt-4 border-b-2 rounded-full border-slate-200 bg-slate-700 text-white active:border-slate-800 hover:bg-slate-800"
                >
                  {loading ? (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Auth;
