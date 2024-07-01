import express from "express";
import {
  refreshAccessToken,
  signin,
  signout,
  signup,
  verifyEmail,
  resendVerificationToken,
} from "../controllers/auth.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/refresh").post(refreshAccessToken);

router.route("/signup").post(upload.single("avatar"), signup);

router.route("/:email/verify/:token").post(verifyEmail);

router.route("/resend-verification/:email").post(resendVerificationToken);

router.route("/signin").post(signin);

router.route("/signout").post(isAuthenticated, signout);

export default router;
