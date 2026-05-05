import { Response } from "express";
import { AuthRequest } from "../../middleware/requireAuth";
import { prisma } from "../lib/prisma";
import nodemailer from "nodemailer";

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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_EM,
    pass: process.env.APP_PW,
  },
});

export const submitContactForm =
  (type: "contact" | "feedback" | "issue") =>
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(400).json({ message: "Unauthorized." });
      }

      const { email, subject, message, issue } = req.body;

      const mailOptions = () => {
        switch (type) {
          case "contact":
            return {
              from: process.env.APP_EM,
              to: process.env.APP_EM,
              subject: `Torq - User Message from ${email}`,
              text: `User ID: ${userId}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
            };
          case "issue":
            return {
              from: process.env.APP_EM,
              to: process.env.APP_EM,
              subject: `Torq - Issue Reported from ${email}`,
              text: `User ID: ${userId}\nEmail: ${email}\nIssue: ${issue}\nMessage: ${message}`,
            };
          case "feedback":
            return {
              from: process.env.APP_EM,
              to: process.env.APP_EM,
              subject: `Torq - User Feedback`,
              text: `User ID: ${userId}\nMessage: ${message}`,
            };
        }
      };

      const options = mailOptions();
      if (!options) {
        return res.status(400).json({ message: "Invalid form type." });
      }

      await transporter.sendMail(options);

      res.status(201).json({ message: `${type} successfully submitted.` });
    } catch {
      res.status(500).json({ message: "Something went wrong." });
    }
  };

export const submitRating = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(400).json({ message: "Unauthorized." });
      return;
    }
    console.log(req.body);

    res.status(201).json({ message: `Rating successfully submitted.` });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong." });
  }
};
