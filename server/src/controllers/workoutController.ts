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
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWorkouts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res
        .status(400)
        .json({ message: "Cannot get user workouts. Unauthorized." });
      return;
    }

    const workouts = await prisma.workout.findMany({
      where: { userId },
      include: { exercises: true },
    });

    res.status(200).json({
      message: "User workouts received.",
      workouts,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!userId) {
      res
        .status(401)
        .json({ message: "Cannot delete user workouts. Unauthorized." });
      return;
    }

    await prisma.workout.delete({ where: { id, userId } });

    return res.status(204).end();
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};
