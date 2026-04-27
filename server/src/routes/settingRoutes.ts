import express from "express";
import { requireAuth } from "../../middleware/requireAuth";
import {
  getSettings,
  submitContactForm,
  updateSettings,
} from "../controllers/settingController";
import { validate } from "../../middleware/validate";
import {
  contactSchema,
  feedbackSchema,
  issueSchmea,
} from "../validation/settingsSchema";

const router = express.Router();

router.get("/", requireAuth, getSettings);

router.patch("/", requireAuth, updateSettings);

router.post(
  "/contact/contact",
  requireAuth,
  validate({ body: contactSchema }),
  submitContactForm("contact"),
);

router.post(
  "/contact/feedback",
  requireAuth,
  validate({ body: feedbackSchema }),
  submitContactForm("feedback"),
);

router.post(
  "/contact/report",
  requireAuth,
  validate({ body: issueSchmea }),
  submitContactForm("issue"),
);

export default router;
