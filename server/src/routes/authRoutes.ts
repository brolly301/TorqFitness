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

const router = express.Router();

router.post("/login", login);

router.post("/signUp", signUp);

router.put("/user", requireAuth, updateUser);

router.delete("/user", requireAuth, deleteUser);

router.get("/user", requireAuth, getUser);

router.patch("/user/changePassword", requireAuth, changePassword);

// router.post("/requestResetCode");

// router.post("/verifyResetCode");

// router.put("/resetPassword");

export default router;
