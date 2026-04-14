import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../../middleware/requireAuth";

export const addWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res
        .status(400)
        .json({ message: "Workout cannot be created. Unauthorized." });
      return;
    }

    const { name, notes, startedAt, completedAt, duration } = req.body;

    console.log(req.body);

    const workout = await prisma.workout.create({
      data: {
        name,
        notes,
        startedAt,
        completedAt,
        duration,
        userId,
      },
    });

    res.status(201).json({
      message: "Workout created",
      workout,
    });
  } catch (e) {
    res.status(400).json({ message: "Internal server error" });
  }
};
