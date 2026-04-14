import express from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { addExercise } from "../controllers/exerciseController";

const router = express.Router();

router.post("/", requireAuth, addExercise);

export default router;
