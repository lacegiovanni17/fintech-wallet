import User from "../models/user";

class UserService {
  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<User | null>}
   */
  static async getUserById(id: string) {
    return await User.findByPk(id);
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<User | null>}
   */
  static async getUserByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }

  /**
   * Create a new user
   * @param {object} userData - User details
   * @returns {Promise<User>}
   */
  static async createUser(userData: { name: string; email: string; password: string }) {
    return await User.create(userData);
  }

  /**
   * Update user details
   * @param {string} id - User ID
   * @param {object} updateData - Fields to update
   * @returns {Promise<[number, User[]]>} - Number of updated rows
   */
  static async updateUser(id: string, updateData: Partial<{ name: string; email: string }>) {
    return await User.update(updateData, { where: { id }, returning: true });
  }
}

export default UserService;
