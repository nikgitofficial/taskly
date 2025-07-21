// backend/controllers/auth/authController.js

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import Student from "../../models/Student.js";
import Employee from "../../models/Employee.js";
import Admin from "../../models/Admin.js";

// Token generators
const generateAccessToken = (user) =>
  jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (user) =>
  jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

// ✅ REGISTER
export const register = async (req, res) => {
  const { email, password, role, name, course, yearLevel, department, position } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password, and role are required." });
  }

  // Optional: basic email format validation
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword, role });

    if (role === "student") {
      if (!name || !course || !yearLevel) {
        await newUser.deleteOne();
        return res.status(400).json({ message: "Missing student information (name, course, year level)." });
      }
      await Student.create({ userId: newUser._id, name, course, yearLevel });
    }

    if (role === "employee") {
      if (!name || !department || !position) {
        await newUser.deleteOne();
        return res.status(400).json({ message: "Missing employee information (name, department, position)." });
      }
      await Employee.create({ userId: newUser._id, name, department, position });
    }
    
    if (role === "admin") {
      if (!name) {
        await newUser.deleteOne();
        return res.status(400).json({ message: "Missing admin information (name)." });
      }
      await Admin.create({ userId: newUser._id, name });
    }

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: err.message || "Registration failed." });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials." });

    const userInfo = { id: user._id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(userInfo);
    const refreshToken = generateRefreshToken(userInfo);

    let student = null;
    let employee = null;
    let admin = null;

    if (user.role === "student") {
      student = await Student.findOne({ userId: user._id });
    } else if (user.role === "employee") {
      employee = await Employee.findOne({ userId: user._id });
    }
    else if (user.role === "admin") {
      admin = await Admin.findOne({ userId: user._id });
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ token: accessToken, user: userInfo, student, employee,admin });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed." });
  }
};

// ✅ GET CURRENT USER
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    console.error("❌ Me fetch error:", err);
    res.status(500).json({ message: "Failed to fetch user." });
  }
};

// ✅ REFRESH TOKEN
export const refreshToken = (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: "Unauthorized: No refresh token." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const userInfo = { id: decoded.id, email: decoded.email, role: decoded.role };
    const newAccessToken = generateAccessToken(userInfo);
    res.json({ token: newAccessToken });
  } catch (err) {
    console.error("❌ Refresh token error:", err);
    res.status(403).json({ message: "Forbidden: Invalid refresh token." });
  }
};

// ✅ LOGOUT
export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  res.json({ message: "Logged out successfully." });
};
