import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../../middleware/requireAuth";

type CreateWorkoutExerciseInput = {
  exerciseId: string;
  order: number;
  notes?: string;
  sets: {
    order: number;
    reps: number;
    weight?: number | null;
  }[];
};

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

    const { exercises } = req.body as {
      exercises: CreateWorkoutExerciseInput[];
    };

    const workout = await prisma.workout.create({
      data: {
        name,
        notes,
        startedAt,
        completedAt,
        duration,
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
      include: { exercises: { include: { sets: true } } },
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
