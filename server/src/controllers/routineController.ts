import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../../middleware/requireAuth";

export const addRoutine = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res
        .status(401)
        .json({ message: "Routine cannot be created. Unauthorized." });
      return;
    }

    const { name, notes } = req.body;

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
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRoutines = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res
        .status(401)
        .json({ message: "Cannot get user routines. Unauthorized." });
      return;
    }

    const routines = await prisma.routine.findMany({
      where: { userId },
      include: { exercises: true },
    });

    res.status(200).json({
      message: "User routines received.",
      routines,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteRoutine = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!userId) {
      res
        .status(401)
        .json({ message: "Cannot delete user routines. Unauthorized." });
      return;
    }

    await prisma.routine.delete({ where: { id, userId } });

    return res.status(204).end();
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};
