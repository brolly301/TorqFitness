import express from "express";
import { requireAuth } from "../../middleware/requireAuth";
import {
  addRoutine,
  deleteRoutine,
  getRoutines,
  updateRoutine,
} from "../controllers/routineController";
import { validate } from "../../middleware/validate";
import { routineSchema } from "../validation/routineSchema";

const router = express.Router();

router.post("/", requireAuth, validate({ body: routineSchema }), addRoutine);

router.get("/", requireAuth, getRoutines);

router.delete("/:id", requireAuth, deleteRoutine);

router.put("/:id", requireAuth, updateRoutine);

export default router;
