import express from "express";

import { login, registerUser, verifyUser } from "./user.controller";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:token", verifyUser);
router.post("/login", login);

export default router;
