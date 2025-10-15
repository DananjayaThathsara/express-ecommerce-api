import bcrypt from "bcryptjs";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../configs/config.js";

/**
 * Register user
 * POST /api/auth/register
 */

export async function register(req, res, next) {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;

    //validate fields
    if (!name || !email || !password) {
      return res.status(400).json("Name, Email and Password are required");
    }

    //check for duplicates
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json("Email is already used");
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    const user = await User.create({ name, email, password: hashedPassword });

    //return safe user data
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login User
 * POST /api/auth/login
 */

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    //validate required fields
    if (!email || !password) {
      return res.status(400).json("Email and Password are required");
    }

    //get user from email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // check password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //create jwt payload
    const payload = { sub: user._id.toString(), role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.emai,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}
