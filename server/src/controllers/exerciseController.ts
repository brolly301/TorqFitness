import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../../middleware/requireAuth";

export const addExercise = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res
        .status(400)
        .json({ message: "Routine cannot be created. Unauthorized." });
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
    res.status(400).json({ message: "Internal server error" });
  }
};
