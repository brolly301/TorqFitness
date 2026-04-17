import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../../middleware/requireAuth";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { email },
      include: { settings: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const userData = {
      userId: user.id,
      firstName: user.firstName,
      surname: user.surname,
      email: user.email,
      settings: user.settings,
    };

    res.status(200).json({ message: "Login successful.", userData, token });
  } catch (e) {
    console.log("Login error", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { password, ...body } = req.body;

    const existingEmail = await prisma.user.findFirst({
      where: { email: body.email },
    });

    if (existingEmail) {
      res
        .status(400)
        .json({ message: "A user with this email already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        ...body,
        password: hashedPassword,
      },
      include: { settings: true },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const userData = {
      userId: user.id,
      firstName: user.firstName,
      surname: user.surname,
      email: user.email,
      settings: user.settings,
    };

    res
      .status(200)
      .json({ message: "Successfully signed up", token, userData });
  } catch (err) {
    console.error("Sign up error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(400).json({ message: "Cannot update user. Unauthorized." });
      return;
    }

    const { firstName, surname, email } = req.body;

    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        surname,
        email,
      },
    });

    res.status(201).json({
      message: "User details updated successfully.",
    });
  } catch (e) {}
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(400).json({ message: "Cannot update user. Unauthorized." });
      return;
    }

    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User password updated successfully.",
    });
  } catch (e) {}
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const authorizationHeader = req.headers.authorization;

    const token = authorizationHeader?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No token was provided." });
      return;
    }

    const { userId } = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: { settings: true },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userData = {
      userId: user.id,
      firstName: user.firstName,
      surname: user.surname,
      email: user.email,
      settings: user.settings,
    };

    res.status(200).json({ message: "Successfully retrieved user", userData });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(204).end();
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
