import express from "express";

import { login, registerUser, verifyUser, getMe, logoutUser, resetPassword, forgotPassword, verifyUserEmptyToken } from "./user.controller";
import { isLoggedIn } from "@/middlewares/auth.middleware";
import { validateTokenPresence } from "@/middlewares/user.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/", verifyUserEmptyToken);
router.get("/verify/:token", validateTokenPresence, verifyUser);
router.post("/login", login);
router.get("/profile", isLoggedIn, getMe);
router.get("/logout",  logoutUser);
router.post("/reset", isLoggedIn,  resetPassword);
router.get("/forgot",  forgotPassword);

export default router;
