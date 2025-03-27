import express from "express";
import { register, login } from "../controllers/auth.controller";
import { validate } from "../validations/auth.validation";
import { registerValidation, loginValidation } from "../validations/auth.validation";
import { apiLimiter } from "../middlewares/ratelimit.middleware";

const authrouter = express.Router();

authrouter.post("/register", apiLimiter, validate(registerValidation), register);
authrouter.post("/login", apiLimiter, validate(loginValidation), login);

export default authrouter;
