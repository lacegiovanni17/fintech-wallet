import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const registerValidation = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Middleware to validate the request using the Joi schema
export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const {error} = schema.validate(req.body, {abortEarly: false});
      if (error) {
        const formattedErrors = error.details.map(err => ({
          message: err.message,
        }));
        
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: formattedErrors,
        });
      }
      next();
    };
  };
