import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/response.js";

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Missing required fields", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,      // must be false for localhost
      sameSite: "lax",    // safer default
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return successResponse(res, "Login successful");
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error in login");
  }
};

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return errorResponse(res, "Missing required fields", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, "User already exists", 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      name,
      passwordHash,
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return successResponse(res, "Registration successful", {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    }, 201);

  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error in registering");
  }
};

// ================= LOGOUT =================
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,      // must be false for localhost
      sameSite: "lax",
      path: "/",
    });

    return res.json({ success: true, message: "Logged Out" });
  }
  catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error checking authentication" });
  }
}

// ================= CHECK AUTHENTICATION  =================
export const isAuthenticated = async (req, res) => {
  try {
    const  token  = req.cookies.token;

    if (!token) {
      return res.json({ success: false, message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    return res.json({ success: true, userId: decoded.userId });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error checking authentication" });
  }
};

// ================= GET PROFILE DETAILS =================
export const getprofile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password -otp -otpExpiry"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting profile",
      error: error.message,
    });
  }
};