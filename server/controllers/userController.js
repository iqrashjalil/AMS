import User from "../models/userModel.js";
import { ErrorHandler } from "../utils/error-handler.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import sendToken from "../utils/jwtToken.js";
import { renameSync, unlinkSync } from "fs";

const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!req.file) {
    return next(new ErrorHandler("Please upload an image", 400));
  }
  const date = Date.now();
  let fileName = "uploads/profiles/" + date + req.file.originalname;

  renameSync(req.file.path, fileName);
  if (!name || !email || !password) {
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
    profilePicture: fileName,
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
  res.cookie("token", null, {
    expires: new Date(0),
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });
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
  const { name, email, password } = req.body;
  console.log(req.body);
  console.log(req.file); // Debugging: Check if req.file is defined

  // Find the user by ID
  const user = await User.findById(req.user._id);

  // Update the user's fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;

  // Check if the user has uploaded a new profile picture
  if (req.file) {
    const date = Date.now();
    const fileName = "uploads/profiles/" + date + req.file.originalname;

    renameSync(req.file.path, fileName);
    user.profilePicture = fileName; // Update the profile picture
  }

  // Save the updated user (this will trigger the `pre("save")` middleware)
  await user.save();

  res.status(200).json({ success: true, updatedUser: user });
});

const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, allUsers: users });
});
export default { register, login, logout, getUser, updateUser, getAllUsers };
