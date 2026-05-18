import express from "express";
import {
  changePassword,
  deleteUser,
  getUser,
  login,
  requestResetCode,
  resetPassword,
  signUp,
  updateUser,
  verifyResetCode,
} from "../controllers/authController";
import { requireAuth } from "../../middleware/requireAuth";
import { validate } from "../../middleware/validate";
import {
  changePasswordSchema,
  loginSchema,
  requestResetCodeSchema,
  resetPasswordSchema,
  signUpSchema,
  updateProfileSchema,
  verifyResetCodeSchema,
} from "../validation/authSchema";

const router = express.Router();

router.post("/login", validate({ body: loginSchema }), login);

router.post("/signUp", validate({ body: signUpSchema }), signUp);

router.post(
  "/user/requestResetCode",
  validate({ body: requestResetCodeSchema }),
  requestResetCode,
);

router.post(
  "/user/verifyResetCode",
  validate({ body: verifyResetCodeSchema }),
  verifyResetCode,
);

router.patch(
  "/user/resetPassword",
  validate({ body: resetPasswordSchema }),
  resetPassword,
);

router.get("/user", requireAuth, getUser);

router.put(
  "/user",
  requireAuth,
  validate({ body: updateProfileSchema }),
  updateUser,
);

router.delete("/user", requireAuth, deleteUser);

router.patch(
  "/user/changePassword",
  requireAuth,
  validate({ body: changePasswordSchema }),
  changePassword,
);

export default router;
