import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error-middleware.js";
import userRoute from "./routes/userRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

const app = express();

const Port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoute);
app.use("/api/attendance", attendanceRoutes);

const server = app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

app.use(errorMiddleware);

export default app;
