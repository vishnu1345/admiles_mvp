import express from "express";
import passport from "passport";

const router = express.Router();

/* ---------- SIGNUP WITH ROLE ---------- */
router.get(
  "/google",
  (req, res, next) => {
    const role = (req.query.role || "").toLowerCase();
    if (!["driver", "business"].includes(role))
      return res.status(400).send("Invalid or missing role");
    req.session.role = role;
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/* ---------- LOGIN (no role, just existing users) ---------- */
router.get(
  "/google-login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/* ---------- CALLBACK ---------- */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_URL + "?auth=failed",
  }),
  (req, res) => {
    if (req.session) req.session.role = undefined;

    const role = req.user.role;

    // If profile incomplete → go to registration form
    if (!req.user.completed) {
      return res.redirect(`${process.env.CLIENT_URL}/register/${role}`);
    }

    // Otherwise → dashboard
    return res.redirect(`${process.env.CLIENT_URL}/${role}-dashboard`);
  }
);

/* ---------- WHO AM I (session check) ---------- */
router.get("/me", (req, res) => {
  if (!req.user) return res.json(null);
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    completed: req.user.completed,
  });
});

/* ---------- LOGOUT ---------- */
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

export default router;
