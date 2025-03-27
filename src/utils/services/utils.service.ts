import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { IGenericResponseModel } from "../interfaces/generic_response.interface";

dotenv.config();

class UtilService {
  /**
   * Builds a standardized API success response.
   */
  public buildApiResponse<T>(response: IGenericResponseModel<T>): IGenericResponseModel<T> {
    return {
      ...response,
      success: true,
      statusCode: response.statusCode || 200,
    };
  }

  /**
   * Builds a standardized API error response.
   */
  public buildApiErrorResponse<T>(response: IGenericResponseModel<T>): IGenericResponseModel<T> {
    return {
      ...response,
      success: false,
      statusCode: response.statusCode || 400,
    };
  }

  // ─── Password Utilities ───────────────────────────────────────────────────

  /**
   * Hashes a password using bcrypt.
   */
  public hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  /**
   * Compares a password with a hashed password.
   */
  public comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  /**
   * Validates password strength.
   */
  public validatePassword(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  }

  // ─── OTP & Reset Code ────────────────────────────────────────────────────

  /**
   * Generates a 4-digit reset code and its expiration time (10 minutes).
   */
  public generateResetCode(): { code: number; expiresIn: Date } {
    return {
      code: Math.floor(1000 + Math.random() * 9000),
      expiresIn: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiration
    };
  }

  /**
   * Checks if a reset code has expired (5 minutes).
   */
  public hasCodeExpired(createdAt: Date): boolean {
    return (new Date().getTime() - new Date(createdAt).getTime()) > 5 * 60 * 1000;
  }

  /**
   * Generates a 4-digit OTP.
   */
  public generateOTP(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  // ─── Token Management ─────────────────────────────────────────────────────

  /**
   * Generates a JWT token.
   */
  public generateToken(userId: string, email: string) {
    const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });
  
    return {
      token,
      expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiration
    };
  }
  


  // ─── URL Validation ───────────────────────────────────────────────────────

  /**
   * Validates whether a string is a valid URL.
   */
  public isValidUrl(url: string): boolean {
    return /^(ftp|http|https):\/\/[^ "]+$/.test(url);
  }
}

export default UtilService;
