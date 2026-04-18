import express from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { getSettings, updateSettings } from "../controllers/settingController";

const router = express.Router();

router.get("/", requireAuth, getSettings);

router.patch("/", requireAuth, updateSettings);

// router.put("/", requireAuth, updateSettings);

export default router;
