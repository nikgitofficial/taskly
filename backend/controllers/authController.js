// controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Student from "../models/Student.js";

// Token generators
const generateAccessToken = (user) =>
  jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (user) =>
  jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

// Register
export const register = async (req, res) => {
  const { email, password, role, name, course, yearLevel } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ email, password: hashedPassword, role });

    if (role === "student") {
      if (!name || !course || !yearLevel) {
        return res.status(400).json({ message: "Missing student information" });
      }

      await Student.create({
        userId: newUser._id,
        name,
        course,
        yearLevel,
      });
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userInfo = { id: user._id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(userInfo);
    const refreshToken = generateRefreshToken(userInfo);

    let student = null;
    if (user.role === "student") {
      student = await Student.findOne({ userId: user._id });
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ token: accessToken, user: userInfo, student });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// Get current user
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// ✅ FIXED refreshToken
export const refreshToken = (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: "Unauthorized: No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const userInfo = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    const newAccessToken = generateAccessToken(userInfo);
    res.json({ token: newAccessToken });
  } catch (err) {
    console.error("❌ Refresh token error:", err.message);
    res.status(403).json({ message: "Forbidden: Invalid refresh token" });
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({ message: "Logged out" });
};
