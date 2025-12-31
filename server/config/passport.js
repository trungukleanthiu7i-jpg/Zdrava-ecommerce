import dotenv from "dotenv";
dotenv.config();

/* =========================
   🔎 DEBUG (OPTIONAL)
========================= */
console.log("GOOGLE_CLIENT_ID =", process.env.GOOGLE_CLIENT_ID);

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/User.js";

/* =========================
   🔐 GOOGLE STRATEGY
   (uses email)
========================= */
if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile?.emails?.[0]?.value || null;

          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // 🔗 Link to existing account by email if exists
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
              username:
                profile.displayName ||
                (email ? email.split("@")[0] : "user"),
              provider: "google",
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn("⚠️ Google OAuth disabled: missing env vars");
}

/* =========================
   🔐 FACEBOOK STRATEGY
   (NO email, username only)
========================= */
if (
  process.env.FACEBOOK_APP_ID &&
  process.env.FACEBOOK_APP_SECRET
) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/api/auth/facebook/callback",
        profileFields: ["id", "displayName"], // 👈 no email
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ facebookId: profile.id });

          if (!user) {
            user = await User.create({
              facebookId: profile.id,
              username: profile.displayName, // 👈 Facebook name
              provider: "facebook",
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn("⚠️ Facebook OAuth disabled: missing env vars");
}

export default passport;
