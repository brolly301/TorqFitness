import express from "express";
import { requireAuth } from "../../middleware/requireAuth";
import {
  addExercise,
  archiveExercise,
  getExercises,
  updateExercise,
} from "../controllers/exerciseController";
import { validate } from "../../middleware/validate";
import { exerciseSchema } from "../validation/exerciseSchema";

const router = express.Router();

router.post("/", requireAuth, validate({ body: exerciseSchema }), addExercise);

router.get("/", requireAuth, getExercises);

router.patch("/:id", requireAuth, archiveExercise);

router.put(
  "/:id",
  requireAuth,
  validate({ body: exerciseSchema }),
  updateExercise,
);

export default router;
