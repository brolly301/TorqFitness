import express from "express";
import { getUser, login, signUp } from "../controllers/authController";
// import { requireAuth } from "../../middleware/requireAuth";

const router = express.Router();

router.post("/login", login);

router.post("/signUp", signUp);

// router.patch("/user/:id");

// router.delete("/user/:id");

// router.get("/user", requireAuth, getUser);

// router.post("/requestResetCode");

// router.post("/verifyResetCode");

// router.put("/resetPassword");

// router.put("/changePassword");

export default router;
