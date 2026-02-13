import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://zdrava-ecommerce-backend.onrender.com/api/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          console.log("🔥 Google profile received:", profile);

          const email = profile?.emails?.[0]?.value || null;
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            if (email) {
              const existingUser = await User.findOne({ email });
              if (existingUser) {
                existingUser.googleId = profile.id;
                existingUser.provider = "google";
                await existingUser.save();
                return done(null, existingUser);
              }
            }

            user = await User.create({
              googleId: profile.id,
              email,
              username: profile.displayName || (email ? email.split("@")[0] : "user"),
              provider: "google",
            });
            console.log("✅ Created new user:", user);
          }

          return done(null, user);
        } catch (err) {
          console.error("❌ Passport GoogleStrategy error:", err);
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn("⚠️ Google OAuth disabled: missing env vars");
}

export default passport;
