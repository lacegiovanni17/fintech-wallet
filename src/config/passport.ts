import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { AppDataSource } from "./data-source";
import { User } from "../entities/User";
import { env } from "./env";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.auth.googleClientId,
      clientSecret: env.auth.googleClientSecret,
      callbackURL: "/auth/google/callback",
    },
    async (_, __, profile, done) => {
      const repo = AppDataSource.getRepository(User);
      let user = await repo.findOneBy({ googleId: profile.id });

      if (!user) {
        user = repo.create({
          name: profile.displayName,
          email: profile.emails?.[0].value,
          googleId: profile.id,
        });
        await repo.save(user);
      }

      done(null, user);
    }
  )
);


passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  const user = await AppDataSource.getRepository(User).findOneBy({ id });
  done(null, user);
});


export default passport;
