import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/User.js";

/* =========================================
   🌍 GOOGLE CONFIG
========================================= */
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL ||
  "https://zdrava-ecommerce-backend.onrender.com/api/auth/google/callback";

console.log("🔐 Google OAuth config:", {
  hasClientId: Boolean(GOOGLE_CLIENT_ID),
  hasClientSecret: Boolean(GOOGLE_CLIENT_SECRET),
  callbackURL: GOOGLE_CALLBACK_URL,
});

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          console.log("🔥 Google profile:", {
            id: profile.id,
            email: profile?.emails?.[0]?.value,
            name: profile.displayName,
          });

          const email = profile?.emails?.[0]?.value || null;

          let user = await User.findOne({ googleId: profile.id });

          if (!user && email) {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
              existingUser.googleId = profile.id;
              existingUser.provider = "google";
              await existingUser.save();
              return done(null, existingUser);
            }
          }

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              email,
              username:
                profile.displayName ||
                (email ? email.split("@")[0] : "user"),
              provider: "google",
            });

            console.log("✅ Created Google user:", user._id);
          }

          return done(null, user);
        } catch (err) {
          console.error("❌ GoogleStrategy error:", err);
          return done(err, null);
        }
      }
    )
  );

  console.log("✅ Google strategy registered");
} else {
  console.warn("⚠️ Google OAuth disabled: missing env vars");
}

/* =========================================
   📘 FACEBOOK CONFIG
========================================= */
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_CALLBACK_URL =
  process.env.FACEBOOK_CALLBACK_URL ||
  "https://zdrava-ecommerce-backend.onrender.com/api/auth/facebook/callback";

console.log("📘 Facebook OAuth config:", {
  hasAppId: Boolean(FACEBOOK_APP_ID),
  hasAppSecret: Boolean(FACEBOOK_APP_SECRET),
  callbackURL: FACEBOOK_CALLBACK_URL,
});

if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "displayName", "emails"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          console.log("📘 Facebook profile:", {
            id: profile.id,
            email: profile?.emails?.[0]?.value,
            name: profile.displayName,
          });

          const email = profile?.emails?.[0]?.value || null;

          let user = await User.findOne({ facebookId: profile.id });

          if (!user && email) {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
              existingUser.facebookId = profile.id;
              existingUser.provider = "facebook";
              await existingUser.save();
              return done(null, existingUser);
            }
          }

          if (!user) {
            user = await User.create({
              facebookId: profile.id,
              email,
              username:
                profile.displayName ||
                (email ? email.split("@")[0] : "user"),
              provider: "facebook",
            });

            console.log("✅ Created Facebook user:", user._id);
          }

          return done(null, user);
        } catch (err) {
          console.error("❌ FacebookStrategy error:", err);
          return done(err, null);
        }
      }
    )
  );

  console.log("✅ Facebook strategy registered");
} else {
  console.warn("⚠️ Facebook OAuth disabled: missing env vars");
}

export default passport;