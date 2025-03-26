import express from "express";
import { register, login } from "../controllers/auth.controller";
import { validate } from "../validations/auth.validation";
import { registerValidation, loginValidation } from "../validations/auth.validation";

const router = express.Router();

// router.post("/register", validate(registerValidation), register);
// router.post("/login", validate(loginValidation), login);

export default router;
