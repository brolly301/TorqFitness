import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../../middleware/requireAuth";

export const addExercise = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(400).json({ message: "Unauthorized." });
      return;
    }

    const {
      name,
      gifUrl,
      bodyParts,
      primaryMuscles,
      secondaryMuscles,
      equipment,
      instructions,
      userCreated,
    } = req.body;

    const exercise = await prisma.exercise.create({
      data: {
        name,
        gifUrl,
        bodyParts,
        primaryMuscles,
        secondaryMuscles,
        equipment,
        instructions,
        userCreated,
        userId,
      },
    });

    res.status(201).json({
      message: "Exercise created",
      exercise,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getExercises = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(400).json({ message: "Cannot get exercises. Unauthorized." });
      return;
    }

    const exercises = await prisma.exercise.findMany({
      where: {
        archived: false,
        OR: [{ userId: null }, { userId }],
      },
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      message: "User exercises received.",
      exercises,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const archiveExercise = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!userId) {
      res
        .status(401)
        .json({ message: "Cannot get user exercises. Unauthorized." });
      return;
    }

    await prisma.exercise.update({
      where: { userId, id },
      data: { archived: true },
    });

    res.status(200).json({
      message: "Exercise successfully archived.",
    });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateExercise = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!userId) {
      res
        .status(401)
        .json({ message: "Cannot update user exercise. Unauthorized." });
      return;
    }
    const {
      name,
      gifUrl,
      bodyParts,
      primaryMuscles,
      secondaryMuscles,
      equipment,
      instructions,
      userCreated,
    } = req.body;

    const exercise = await prisma.exercise.update({
      where: { id },
      data: {
        name,
        gifUrl,
        bodyParts,
        primaryMuscles,
        secondaryMuscles,
        equipment,
        instructions,
        userCreated,
      },
    });

    res
      .status(201)
      .json({ message: "Exercise successfully updated.", exercise });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};
