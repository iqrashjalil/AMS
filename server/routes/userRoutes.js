import multer from "multer";
import userController from "../controllers/userController.js";
import { authMiddleware, isAdmin } from "../middlewares/auth-middleware.js";
import { Router } from "express";

const router = Router();
const upload = multer({ dest: "uploads/profiles" });
router
  .route("/register")
  .post(upload.single("profilePicture"), userController.register);
router.route("/login").post(userController.login);
router.route("/logout").post(userController.logout);
router.route("/getuser").get(authMiddleware, userController.getUser);
router
  .route("/updateuser")
  .patch(
    upload.single("profilePicture"),
    authMiddleware,
    userController.updateUser
  );
router
  .route("/getallusers")
  .get(authMiddleware, isAdmin, userController.getAllUsers);

export default router;
