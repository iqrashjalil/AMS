import attendanceController from "../controllers/attendanceController.js";
import { authMiddleware, isAdmin } from "../middlewares/auth-middleware.js";
import { Router } from "express";

const router = Router();

router
  .route("/markattendance")
  .post(authMiddleware, attendanceController.markAttendance);

router
  .route("/getallattendance")
  .post(authMiddleware, isAdmin, attendanceController.getAllAttendance);
router
  .route("/updateattendance/:id")
  .patch(authMiddleware, isAdmin, attendanceController.updateAttendance);
router
  .route("/deleteattendance/:id")
  .delete(authMiddleware, isAdmin, attendanceController.deleteAttendance);
router
  .route("/getuserattendance")
  .post(authMiddleware, isAdmin, attendanceController.getUserAttendance);
router
  .route("/getmyattendance")
  .get(authMiddleware, attendanceController.getMyAttendance);
router
  .route("/isAttendanceMarked")
  .get(authMiddleware, attendanceController.isAttendanceMarked);
router
  .route("/getattendancedetails/:id")
  .get(authMiddleware, isAdmin, attendanceController.getAttendanceDetails);
export default router;
