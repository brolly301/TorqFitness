import express from "express";
import {
  addWorkout,
  deleteWorkout,
  getWorkouts,
  updateWorkout,
} from "../controllers/workoutController";
import { requireAuth } from "../../middleware/requireAuth";
import { validate } from "../../middleware/validate";
import { workoutSchema } from "../validation/workoutSchema";

const router = express.Router();

router.post("/", requireAuth, validate({ body: workoutSchema }), addWorkout);

router.get("/", requireAuth, getWorkouts);

router.delete("/:id", requireAuth, deleteWorkout);

router.put("/:id", requireAuth, updateWorkout);

export default router;
