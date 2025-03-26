import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";

export const registerValidation = [
  body("fullname").notEmpty().withMessage("Fullname is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  body("phone_number").notEmpty().withMessage("phone_number is required"),
  body("gender").notEmpty().withMessage("gender is required"),
  body("country").notEmpty().withMessage("country is required"),
  body("date_of_birth").notEmpty().withMessage("date_of_birth is required"),
  body("user_type")
    .notEmpty()
    .withMessage("User type is required")
    .isIn(["vendor", "customer"])
    .withMessage('User type must be either "vendor" or "customer"'),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
];

export const verifyOtpValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("code").notEmpty().withMessage("OTP code is required"),
];

export const resetPasswordValidation = [
  body("newPassword").notEmpty().withMessage("Password is required"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required"),
  body("email").notEmpty().withMessage("Account email is required"),
];

export const updatePasswordValidation = [
  body("newPassword").notEmpty().withMessage("Password is required"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required"),
  body("currentPassword")
    .notEmpty()
    .withMessage("Current Password is required"),
  body("code").optional().isNumeric(),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => {
      return {
        message: err.msg,
      };
    });

    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: formattedErrors,
    });
  }
  next();
};
