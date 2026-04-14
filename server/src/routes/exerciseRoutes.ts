import express from "express";
import { requireAuth } from "../../middleware/requireAuth";
import {
  addExercise,
  archiveExercise,
  getExercises,
} from "../controllers/exerciseController";

const router = express.Router();

router.post("/", requireAuth, addExercise);

router.get("/", requireAuth, getExercises);

router.patch("/:id", requireAuth, archiveExercise);

export default router;
