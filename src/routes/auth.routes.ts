import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { env } from "../config/env";

const router = Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
  const user = req.user as User;

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    env.auth.jwtSecret,
    { expiresIn: "1d" }
  );

  res.redirect(`${env.auth.frontendUrl}/auth/success?token=${token}`);
});

export default router;
