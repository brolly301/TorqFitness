import { Response } from "express";
import { AuthRequest } from "../../middleware/requireAuth";
import { prisma } from "../lib/prisma";

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(400).json({ message: "Unauthorized." });
      return;
    }

    const settings = await prisma.settings.findFirst({
      where: { userId },
    });

    const settingsData = {
      theme: settings?.theme,
      fontSize: settings?.fontSize,
      weightLabel: settings?.weightLabel,
    };

    res.status(201).json({
      message: "User settings successfully retrieved.",
      settings: settingsData,
    });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(400).json({ message: " Unauthorized." });
      return;
    }
    const { type, value } = req.body;

    const allowedFields = ["theme", "fontSize", "weightLabel"];

    if (!allowedFields.includes(type)) {
      throw new Error("Invalid setting type");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { settings: { update: { [type]: value } } },
    });

    res.status(201).json({ message: "User settings successfully updated." });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const submitContactForm =
  (type: "contact" | "feedback" | "issue") =>
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(400).json({ message: "Unauthorized." });
        return;
      }
      console.log(req.body);

      res.status(201).json({ message: `${type} successfully submitted.` });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong." });
    }
  };
