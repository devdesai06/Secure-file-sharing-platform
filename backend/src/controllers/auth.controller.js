import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    return res.json({
      Token: token,
      user: { id: user._id, email: user.email, name: user.name },
      message: "Login successful",
    });
  } catch (err) {
    res.json({ error: "Error in registering" });
  }
};

export const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // console.log(req.body);
    if (!email || !name || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      name,
      passwordHash,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    return res.json({
      Token: token,
      user: { id: user._id, email: user.email, name: user.name },
      message: "Registration Done",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error in registering" });
  }
};

