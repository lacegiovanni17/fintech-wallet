// import { Request, Response } from "express";
// import UserService from "../services/user.service";
// import { AuthRequest } from "../middlewares/auth.middleware";

// class UserController {
//   /**
//    * Get user profile
//    * @param {Request} req - Express request object
//    * @param {Response} res - Express response object
//    */
//   static async getProfile(req: AuthRequest, res: Response) {
//     try {
//       const userId = req?.user?.id// Extracted from authentication middleware
//       if (!userId) {
//         return res.status(400).json({ success: false, message: "User ID is required" });
//       }

//       const user = await UserService.getUserById(userId);

//       if (!user) return res.status(404).json({ success: false, message: "User not found" });

//       return res.status(200).json({ success: true, data: user });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
//   }

//   /**
//    * Update user profile
//    * @param {AuthRequest} req - Express request object
//    * @param {Response} res - Express response object
//    */
//   static async updateProfile(req: AuthRequest, res: Response) {
//     try {
//       const userId = req?.user?.id; // Extracted from authentication middleware
//       if (!userId) {
//         return res.status(400).json({ success: false, message: "User ID is required" });
//       }
//       const { name, email } = req.body;

//       const [updated] = await UserService.updateUser(userId, { name, email });

//       if (!updated) return res.status(400).json({ success: false, message: "Update failed" });

//       return res.status(200).json({ success: true, message: "Profile updated successfully" });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
//   }
// }

// export default UserController;
