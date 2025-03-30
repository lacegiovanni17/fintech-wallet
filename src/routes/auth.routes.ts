import express from "express";
import { register, login, findAllUsers, findUserById, updateUserInfo, deleteUserInfo, getBalance } from "../controllers/auth.controller";
import { validate } from "../validations/auth.validation";
import { registerValidation, loginValidation } from "../validations/auth.validation";
import { apiLimiter } from "../middlewares/ratelimit.middleware";
import { authenticateUser } from "../middlewares/auth.middleware";

const authrouter = express.Router();

authrouter.post("/register", apiLimiter, validate(registerValidation), register);
authrouter.post("/login", apiLimiter, validate(loginValidation), login);
authrouter.get('/', apiLimiter, findAllUsers)
authrouter.get('/balance', apiLimiter, getBalance)
authrouter.get('/:id', apiLimiter, findUserById)
authrouter.patch('/:id', apiLimiter, updateUserInfo)
authrouter.delete('/:id', apiLimiter, deleteUserInfo)

export default authrouter;
