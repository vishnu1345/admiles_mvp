export const isAuthed = (req, res, next) => {
  if (req.isAuthenticated?.() && req.user) return next();
  return res.status(401).json({ message: "Unauthorized" });
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.isAuthenticated?.() || !req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.user.role !== role) {
    return res.status(403).json({ message: "Forbidden for this role" });
  }
  next();
};
