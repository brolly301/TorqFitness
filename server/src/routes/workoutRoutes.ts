import express from "express";
import {
  addWorkout,
  deleteWorkout,
  getWorkouts,
} from "../controllers/workoutController";
import { requireAuth } from "../../middleware/requireAuth";

const router = express.Router();

router.post("/", requireAuth, addWorkout);

router.get("/", requireAuth, getWorkouts);

router.delete("/:id", requireAuth, deleteWorkout);

export default router;
