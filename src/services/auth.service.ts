import bcrypt from "bcryptjs";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import { NotFoundException, } from "../utils/exceptions/not_found.exception";
import HttpException from "../utils/exceptions/http.exception";
import { UnauthorizedException } from "../utils/exceptions/unauthorized.exception";
import { BadRequestsException } from "../utils/exceptions/bad_request.exception";

import UtilService from "../utils/services/utils.service";
import User, { UserAttributes } from "../models/user";

const oAuth2Client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

class AuthService {
  private utilService = new UtilService();

  /**
   * User Registration (Traditional)
   */
  public async register(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    phone_number: string
  ) {
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) throw new BadRequestsException("Email already exists");

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        phone_number,
      });

      // Generate token with both id and email
      const token = this.utilService.generateToken(user.id, user.email);

      return this.utilService.buildApiResponse({
        data: { user, token },
        message: "User registered successfully.",
        statusCode: 200,
      });
    } catch (error: any) {
      throw new HttpException(500, error.message || "Registration failed");
    }
  }

  /**
   * User Login (Traditional)
   */
  public async login(email: string, password: string) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new UnauthorizedException("Invalid credentials");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException("Invalid credentials");

      const token = this.utilService.generateToken(user.id, user.email);
      return this.utilService.buildApiResponse({
        data: { user, token },
        message: "Login successful.",
        statusCode: 200,
      });
    } catch (error: any) {
      throw new HttpException(500, error.message || "Login failed");
    }
  }

  /**
   * Google OAuth: Validate Token & Get User Info
   */
  public async googleValidate(code: string) {
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      const ticket = await oAuth2Client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
      });

      const user = ticket.getPayload();
      if (!user) throw new NotFoundException("User not found");

      const acceptedIssuers = ["https://accounts.google.com", "accounts.google.com"];
      if (!acceptedIssuers.includes(user.iss!)) {
        throw new UnauthorizedException("Invalid Issuer");
      }

      if (new Date() >= new Date(user.exp! * 1000)) {
        throw new UnauthorizedException("Token has expired");
      }

      return this.utilService.buildApiResponse({
        data: { userId: user.sub, name: user.name, email: user.email, photo_url: user.picture },
        message: "Google user verified.",
        statusCode: 200,
      });
    } catch (error: any) {
      throw new HttpException(500, error.message);
    }
  }

  /**
   * Fetch Google User Info via API
   */
  private async fetchUserInfo(accessToken: string) {
    try {
      const response = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(500, "Google authentication failed");
    }
  }

  /**
   * Google Login
   */
  public async googleLogin(accessToken: string) {
    try {
      const profile: any = await this.fetchUserInfo(accessToken);
      if (!profile || !profile.email) throw new BadRequestsException("Invalid Google profile");

      const user = await User.findOne({ where: { email: profile.email } });
      if (!user) throw new NotFoundException("User not registered");

      // Generate token with id & email
      const token = this.utilService.generateToken(user.id, user.email);
      return { user, access_token: token };
    } catch (error: any) {
      throw new HttpException(500, error.message || "Google login failed");
    }
  }

  /**
   * Google Registration
   */
  public async googleRegister(accessToken: string) {
    try {
      const profile: any = await this.fetchUserInfo(accessToken);
      if (!profile || !profile.email) throw new BadRequestsException("Invalid Google profile");

      let user = await User.findOne({ where: { email: profile.email } });
      if (!user) {
        user = await User.create({
          email: profile.email,
          fullname: profile.name,
          google_id: profile.id,
          is_email_verified: true,
        });
      }

      const token = this.utilService.generateToken(user.id, user.email);
      return { user, access_token: token };
    } catch (error: any) {
      throw new HttpException(500, error.message || "Google registration failed");
    }
  }

  /**
   * Get All Users
   */
  public async getUsers() {
    try {
      const users = await User.findAll();
      return this.utilService.buildApiResponse({
        data: users,
        message: "Users retrieved successfully.",
        statusCode: 200,
      });
    } catch (error: any) {
      throw new HttpException(500, error.message || "Failed to fetch users");
    }
  }

  /**
   * Get User by ID
   */

  public async getUserById(userId: string) {
    try {
      const user = await User.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException("User not found");

      return this.utilService.buildApiResponse({
        data: user,
        message: "User retrieved successfully.",
        statusCode: 200,
      });
    } catch (error: any) {
      throw new HttpException(500, error.message || "Failed to fetch user");
    }
  }

  /**
   * Update User
   */
  public async updateUser(userId: string, updateData: Partial<UserAttributes>) {
    try {
      // Ensure the user exists before updating
      const user = await User.findByPk(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      // Update the user and return the updated record
      await user.update(updateData);

      return this.utilService.buildApiResponse({
        data: user,
        message: "User updated successfully.",
        statusCode: 200,
      });
    } catch (error: any) {
      throw new HttpException(500, error.message ?? "User update failed");
    }
  }

  /**
   * Delete User
   */
  public async deleteUser(userId: string) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      await user.destroy();

      return this.utilService.buildApiResponse({
        data: null,
        message: "User deleted successfully.",
        statusCode: 200,
      });
    } catch (error: any) {
      throw new HttpException(500, error.message || "Failed to delete user");
    }
  }

  /**
   * Get Balance 
   */
  public async getBalance(userId: string) {
    try {
      const user = await User.findByPk(userId);
      if (!user) throw new NotFoundException("User not found");
      return this.utilService.buildApiResponse({
        data: user.balance,
        message: "User's balance retrieved successfully.",
        statusCode: 200,
      });
    } catch (error: any) {
      throw new HttpException(500, error.message || "Failed to fetch user balance");
    }
  }
}

// Export instance of AuthService
export const authService = new AuthService();
