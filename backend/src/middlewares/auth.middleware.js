export const authMiddleware = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.json({ error: "Invalid auth format" });
    }
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId;
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
