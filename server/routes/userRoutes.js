import userController from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { Router } from "express";

const router = Router();

router.route("/register").post(userController.register);
router.route("/login").post(userController.login);
router.route("/logout").post(userController.logout);
router.route("/getuser").get(authMiddleware, userController.getUser);
router.route("/updateuser").put(authMiddleware, userController.updateUser);

export default router;
