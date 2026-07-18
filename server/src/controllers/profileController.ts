import { Response } from "express";
import { AuthRequest } from "../../middleware/requireAuth";
import { prisma } from "../lib/prisma";

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized.",
      });
    }

    const { heightCm, goalWeightKg, experienceLevel } = req.body;

    const profile = await prisma.profile.upsert({
      where: {
        userId,
      },

      create: {
        userId,
        heightCm,
        goalWeightKg,
        experienceLevel,
      },

      update: {
        heightCm,
        goalWeightKg,
        experienceLevel,
      },
    });

    return res.status(200).json({
      message: "Profile updated successfully.",
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Failed to update profile.",
    });
  }
};

export const createWeightEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized.",
      });
    }

    const { weightKg, measuredAt } = req.body;

    const weightEntry = await prisma.weightEntry.create({
      data: {
        userId,
        weightKg,
        measuredAt,
      },
    });

    // A user may add a historical entry
    const latestWeightEntry = await prisma.weightEntry.findFirst({
      where: {
        userId,
      },
      orderBy: {
        measuredAt: "desc",
      },
    });

    return res.status(201).json({
      message: "Weight entry created successfully.",
      weightEntry,
      currentWeightKg: latestWeightEntry?.weightKg ?? null,
    });
  } catch (error) {
    console.error("Create weight entry error:", error);

    return res.status(500).json({
      message: "Failed to create weight entry.",
    });
  }
};
