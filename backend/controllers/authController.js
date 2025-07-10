import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const generateAccessToken = (user) =>
  jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (user) =>
  jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  const { email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, role });

  res.status(201).json({ message: "Registered successfully" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const userPayload = { id: user._id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ token: accessToken, user: userPayload });
};

export const refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken({ id: user.id, role: user.role, email: user.email });
    res.json({ token: accessToken });
  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.json({ message: "Logged out" });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
};
