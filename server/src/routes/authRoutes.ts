import express from "express";
import {
  changePassword,
  deleteUser,
  getUser,
  login,
  signUp,
  updateUser,
} from "../controllers/authController";
import { requireAuth } from "../../middleware/requireAuth";
import { validate } from "../../middleware/validate";
import {
  changePasswordSchema,
  loginSchema,
  signUpSchema,
  updateProfileSchema,
} from "../validation/authSchema";

const router = express.Router();

router.post("/login", validate({ body: loginSchema }), login);

router.post("/signUp", validate({ body: signUpSchema }), signUp);

router.put(
  "/user",
  requireAuth,
  validate({ body: updateProfileSchema }),
  updateUser,
);

router.delete("/user", requireAuth, deleteUser);

router.get("/user", requireAuth, getUser);

router.patch(
  "/user/changePassword",
  requireAuth,
  validate({ body: changePasswordSchema }),
  changePassword,
);

// router.post("/requestResetCode");

// router.post("/verifyResetCode");

// router.put("/resetPassword");

export default router;
