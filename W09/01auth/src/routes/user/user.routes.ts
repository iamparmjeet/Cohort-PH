import express from "express";

import { login, registerUser, verifyUser, getMe, logoutUser, resetPassword, forgotPassword } from "./user.controller";
import { isLoggedIn } from "@/middlewares/auth.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:token", verifyUser);
router.post("/login", login);
router.get("/profile", isLoggedIn, getMe);
router.get("/logout",  logoutUser);
router.get("/reset",  resetPassword);
router.get("/forgot",  forgotPassword);

export default router;
