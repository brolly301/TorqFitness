import express from "express";
import { requireAuth } from "../../middleware/requireAuth";
import {
  addRoutine,
  deleteRoutine,
  getRoutines,
  updateRoutine,
} from "../controllers/routineController";

const router = express.Router();

router.post("/", requireAuth, addRoutine);

router.get("/", requireAuth, getRoutines);

router.delete("/:id", requireAuth, deleteRoutine);

router.put("/:id", requireAuth, updateRoutine);

export default router;
