import User from "../models/userModel.js";
import { ErrorHandler } from "../utils/error-handler.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import sendToken from "../utils/jwtToken.js";

const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password, role, profilePicture } = req.body;

  if (!name || !email || !password || !role) {
    return next(new ErrorHandler("Please Enter All Fields", 400));
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new ErrorHandler("Email Already Exist", 400));
  }
  const user = await User.create({
    name,
    email,
    password,
    role,
    profilePicture,
  });

  sendToken(user, 200, res);
});

const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter All Fields", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  sendToken(user, 200, res);
});

const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, { expires: new Date(0) });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

const getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({ success: true, user });
});

const updateUser = catchAsyncError(async (req, res, next) => {
  const { name, email, profilePicture } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
      profilePicture,
    },
    { new: true }
  );

  res.status(200).json({ success: true, updatedUser: user });
});
export default { register, login, logout, getUser, updateUser };
