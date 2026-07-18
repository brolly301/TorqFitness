import express from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { validate } from "../../middleware/validate";
import {
  createWeightEntry,
  updateProfile,
} from "../controllers/profileController";
import {
  createWeightEntrySchema,
  updateUserProfileSchema,
} from "../validation/profileSchema";

const router = express.Router();

router.put(
  "/",
  requireAuth,
  validate({ body: updateUserProfileSchema }),
  updateProfile,
);

router.post(
  "/weight",
  requireAuth,
  validate({ body: createWeightEntrySchema }),
  createWeightEntry,
);

export default router;
