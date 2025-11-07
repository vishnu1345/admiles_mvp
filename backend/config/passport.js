import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_PATH,
      passReqToCallback: true,
    },

    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email from Google"), null);

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
         
          const roleFromSession = req.session?.role;
          if (!roleFromSession) {
            // User clicked Login without ever signing up -> reject
            return done(null, false, {
              message: "No role set; please sign up first.",
            });
          }

          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email,
            role: roleFromSession,
          });
        }

        return done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id)
    .then((u) => done(null, u))
    .catch((err) => done(err))
);
