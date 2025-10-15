import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { JWT_SECRET } from "../configs/config.js";

export async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid auth format" });
    }

    const token = parts[1];
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({ _id: payload.sub }).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorize", error: error.message });
  }
}

export function adminOnly(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin role requied" });
  }
}
