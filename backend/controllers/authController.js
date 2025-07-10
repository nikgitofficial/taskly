import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Student from "../models/Student.js";

const generateAccessToken = (user) =>
  jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "50 m" });

const generateRefreshToken = (user) =>
  jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  const { email, password, role, name, course, yearLevel } = req.body;

  try {
    // 1. Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    // 4. If student, create Student profile
    if (role === "student") {
      if (!name || !course || !yearLevel) {
        console.log("Student field check:", { name, course, yearLevel });
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
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};



export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });

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
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ token: accessToken, user: userInfo, student });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

export const refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(user);
    res.json({ token: accessToken });
  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};
