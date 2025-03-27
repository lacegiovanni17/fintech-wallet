import { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service";
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

    const response = await authService.register(first_name, last_name, email, password, phone_number);
    res.json(response);
  } catch (error: any) {
    next(error); // Pass error to global error handler
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

    const response = await authService.login(email, password);
    res.json(response);
  } catch (error: any) {
    next(error); // Pass error to global error handler
  }
};


// Google Login Controller
export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      throw new BadRequestsException("Access token is required");
    }
    const result = await authService.googleLogin(accessToken);
    res.json(result);
  } catch (error: any) {
    next(new HttpException(error?.status, error?.message));
  }
};

// Google Register Controller
export const googleRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      throw new BadRequestsException("Access token is required");
    }
    const result = await authService.googleRegister(accessToken);
    res.json(result);
  } catch (error: any) {
    next(new HttpException(error?.status, error?.message));
  }
};

// Google Validate Code Controller
export const googleValidateCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code } = req.body;
    if (!code) {
      throw new BadRequestsException("Code is required");
    }
    const response = await authService.googleValidate(code);
    res.json(response);
  } catch (error: any) {
    console.error("Error during Google validation:", error?.message);
    next(new HttpException(error?.status, error?.message));
  }
};
