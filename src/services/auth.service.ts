import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

class AuthService {
  /**
   * Register a new user
   * @param {string} first_name - User's first name
   * @param {string} last_name - User's last name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} phone_number - User's phone number
   * @returns {Promise<object>} - Created user and access token
   */
  static async register(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    phone_number: string
  ) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error("Email already exists");

    const user = await User.create({ 
      first_name, 
      last_name, 
      email, 
      password, 
      phone_number
    });

    const token = this.generateToken(user.id);
    return { user, token };
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - Access token
   */
  static async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = this.generateToken(user.id);
    return { user, token };
  }

  /**
   * Generate JWT token
   * @param {string} userId - User ID
   * @returns {string} - JWT token
   */
  static generateToken(userId: string) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });
  }
}

export default AuthService;
