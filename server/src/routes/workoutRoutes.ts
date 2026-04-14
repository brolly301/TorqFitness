import express from "express";
import { addWorkout } from "../controllers/workoutController";
import { requireAuth } from "../../middleware/requireAuth";

const router = express.Router();

router.post("/", requireAuth, addWorkout);

export default router;
