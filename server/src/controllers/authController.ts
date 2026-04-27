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
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
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

    res
      .status(200)
      .json({ message: "Login successful.", userData, token, success: true });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong.", success: false });
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { password, ...body } = req.body;

    const existingEmail = await prisma.user.findFirst({
      where: { email: body.email },
    });

    if (existingEmail) {
      return res.status(409).json({
        message: "A user with this email already exists.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        ...body,
        password: hashedPassword,
      },
    });

    await prisma.settings.create({ data: { userId: user.id } });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const userData = {
      userId: user.id,
      firstName: user.firstName,
      surname: user.surname,
      email: user.email,
    };

    res.status(201).json({
      message: "Successfully signed up",
      token,
      userData,
      success: true,
    });
  } catch (err) {
    console.error("Sign up error:", err);
    res.status(500).json({ message: "Something went wrong.", success: false });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized.", success: false });
    }

    const { firstName, surname, email } = req.body;

    const existingEmail = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId },
      },
    });

    if (existingEmail) {
      return res.status(409).json({
        message: "A user with this email already exists.",
        success: false,
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        surname,
        email,
      },
    });

    res.status(200).json({
      message: "User details updated successfully.",
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized.", success: false });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect", success: false });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different than current password",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      message: "User password updated successfully.",
      success: true,
    });
  } catch (err) {
    console.error("Sign up error:", err);
    res.status(500).json({ message: "Something went wrong.", success: false });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const authorizationHeader = req.headers.authorization;

  const token = authorizationHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token was provided.", success: false });
    return;
  }

  let userId: string;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    userId = decoded.userId;
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token.",
      success: false,
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: { settings: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const userData = {
      userId: user.id,
      firstName: user.firstName,
      surname: user.surname,
      email: user.email,
      settings: user.settings,
    };

    res.status(200).json({
      message: "Successfully retrieved user",
      success: true,
      userData,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong..", success: false });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized", success: false });
      return;
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: "Something went wrong.", success: false });
  }
};
