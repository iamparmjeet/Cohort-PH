import express from "express";

import { registerUser } from "./user.controller";

const router = express.Router();

router.post("/users/register", registerUser);

export default router;
