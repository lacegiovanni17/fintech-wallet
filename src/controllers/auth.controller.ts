import { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service";
import { BadRequestsException } from "../utils/exceptions/bad_request.exception";
import HttpException from "../utils/exceptions/http.exception";

//Traditional Register
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { first_name, last_name, email, password, phone_number } = req.body;

    if (!first_name || !last_name || !email || !password || !phone_number) {
      throw new BadRequestsException("All fields are required");
    }

    const { user, token } = await AuthService.register(first_name, last_name, email, password, phone_number);
    res.status(201).json({ message: "User registered successfully", user, token });
  } catch (error: any) {
    next(new HttpException(error?.status , error?.message));
  }
};


//Traditional Login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestsException("Email and password are required");
    }

    const { user, token } = await AuthService.login(email, password);
    res.status(200).json({ message: "Login successful", user, token });
  } catch (error: any) {
    next(new HttpException(error?.status , error?.message));
  }
};
