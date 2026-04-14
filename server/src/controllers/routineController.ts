import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../../middleware/requireAuth";

export const addRoutine = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res
        .status(400)
        .json({ message: "Routine cannot be created. Unauthorized." });
      return;
    }

    const { name, notes } = req.body;

    console.log(req.body);

    const routine = await prisma.routine.create({
      data: {
        name,
        notes,
        userId,
      },
    });

    res.status(201).json({
      message: "Routine created",
      routine,
    });
  } catch (e) {
    res.status(400).json({ message: "Internal server error" });
  }
};
