import express from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { addRoutine } from "../controllers/routineController";

const router = express.Router();

router.post("/", requireAuth, addRoutine);

export default router;
