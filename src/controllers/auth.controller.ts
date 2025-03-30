import { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service";
import { BadRequestsException } from "../utils/exceptions/bad_request.exception";
import HttpException from "../utils/exceptions/http.exception";
import { updateUserValidation } from "../validations/auth.validation";
import { IGenericResponseModel } from "../utils/interfaces/generic_response.interface";
import { AuthRequest } from "../middlewares/auth.middleware";

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
}

export const getBalance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id; // Ensure user is authenticated

    if (!userId) {
      throw new HttpException(401, "Unauthorized: User ID is missing");
    }

    const balance = await authService.getBalance(userId);
    res.status(200).json({ success: true, balance });
  } catch (error: any) {
    next(new HttpException(error?.status || 500, error?.message || "Internal Server Error"));
  }
};

export const findAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await authService.getUsers();
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error: any) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ error: error.message ?? "Internal server error" });
  }
}

export const findUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new Error("User ID is required");
    }

    const user = await authService.getUserById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User fetched successfully", user });
  } catch (error: any) {
    console.error("Error in findUserById:", error);
    res.status(500).json({ error: error.message ?? "Internal server error" });
  }
}

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const { error, value: data } = updateUserValidation.validate(req.body); // Validate incoming data
    if (error) {
      res.status(400).json({ error: error.details[0]?.message ?? "Invalid request data" });
      return;
    }
    const user = await authService.updateUser(id, data);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error: any) {
    console.error("Error in updateUserInfo:", error);
    res.status(400).json({ error: error.errors ?? error.message ?? "Invalid request" });
  }
};

export const deleteUserInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    await authService.deleteUser(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Error in deleteUser:", error);
    res.status(400).json({ error: error.errors ?? error.message ?? "Invalid request" });
  }
}