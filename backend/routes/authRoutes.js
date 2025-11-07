import express from "express";
import passport from "passport";

const router = express.Router();

/**
 * SIGNUP with role:
 * /auth/google?role=driver
 * /auth/google?role=business
 */

router.get(
  "/google",
  (req, res, next) => {
    const role = (req.query.role || "").toLowerCase();
    if (!["driver", "business"].includes(role)) {
      return res.status(400).send("Invalid or missing role");
    }
    req.session.role = role; // used in passport verify callback
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);


/**
 * LOGIN (single button). No role is set here.
 * If user already exists, they’ll be found; if not, we reject in the strategy.
 */
router.get(
  "/google-login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


/**
 * Common callback for both signup & login
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_URL + "?auth=failed",
  }),
  (req, res) => {
    // clear role hint after use
    if (req.session) req.session.role = undefined;

    // Redirect based on persisted role
    const role = req.user.role;
    if (role === "driver") {
      return res.redirect(process.env.CLIENT_URL + "/driver-dashboard");
    }
    return res.redirect(process.env.CLIENT_URL + "/business-dashboard");
  }
);

/** who am i */
router.get("/me", (req, res) => {
  if (!req.user) return res.json(null);
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});


router.get("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("connect.sid");
    res.redirect(process.env.CLIENT_URL);
  });
});

export default router;
