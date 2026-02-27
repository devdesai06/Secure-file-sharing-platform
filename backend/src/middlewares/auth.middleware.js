import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;   // 👈 read from cookies

    if (!token) {
      return res.status(401).json({ error: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = { _id: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

}