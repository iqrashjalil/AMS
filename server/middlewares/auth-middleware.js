import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/error-handler.js";
import User from "../models/userModel.js";
import { catchAsyncError } from "./catchAsyncError.js";

export const authMiddleware = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new ErrorHandler("You are not logged in or can't access token", 401)
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorHandler("User not found", 404));
    }

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token", 401));
  }
});

export const isAdmin = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    return next(new ErrorHandler("You are not allowed to access this", 403));
  } else {
    next();
  }
});
