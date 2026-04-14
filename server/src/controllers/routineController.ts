import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../../middleware/requireAuth";

type CreateRoutineExerciseInput = {
  exerciseId: string;
  order: number;
  notes?: string;
  sets: {
    order: number;
    reps: number;
    weight?: number | null;
  }[];
};

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

    const { exercises } = req.body as {
      exercises: CreateRoutineExerciseInput[];
    };

    const routine = await prisma.routine.create({
      data: {
        name,
        notes,
        userId,
        exercises: {
          create: exercises.map((exercise) => ({
            exerciseId: exercise.exerciseId,
            order: exercise.order,
            notes: exercise.notes,
            sets: {
              create: exercise.sets.map((set) => ({
                order: set.order,
                reps: set.reps,
                weight: set.weight,
              })),
            },
          })),
        },
      },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
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
      include: { exercises: { include: { sets: true } } },
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
