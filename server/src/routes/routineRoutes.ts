import express from "express";
import { requireAuth } from "../../middleware/requireAuth";
import {
  addRoutine,
  deleteRoutine,
  getRoutines,
} from "../controllers/routineController";

const router = express.Router();

router.post("/", requireAuth, addRoutine);

router.get("/", requireAuth, getRoutines);

router.delete("/:id", requireAuth, deleteRoutine);

export default router;
