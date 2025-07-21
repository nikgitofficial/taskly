import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
       id: decoded.id || decoded._id, 
       role: decoded.role, 
      };  
    if (!req.user.id) throw new Error("User ID missing in token");
    next();
  } catch (err) {
    console.error("❌ JWT Verification Failed:", err.message);
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};
