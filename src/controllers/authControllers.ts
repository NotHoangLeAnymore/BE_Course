import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

//register a new user
export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env["JWT_SECRETE"] as string,
      {
        expiresIn: "7h",
      },
    );
    return res
      .status(201)
      .json({ token, user: { id: String(user._id), name, email } });
  } catch (error) {
    return res.status(500).json({ message: "Đăng ký thất bại" });
  }
}

// Đăng nhập
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { userId: String(user._id), name: user.name, email: user.email },
      process.env["JWT_SECRETE"] as string,
      { expiresIn: "7d" },
    );
    return res.status(201).json({
      token,
      user: { id: String(user._id), name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Đăng nhập thất bại" });
  }
}

export default { register, login };
