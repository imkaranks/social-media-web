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
import {
  resendVerificationTokenValidator,
  signinValidator,
  signupValidator,
  verifyEmailValidator,
} from "../validations/middlewares/auth.middlewares.js";

const router = express.Router();

router.route("/refresh").post(refreshAccessToken);

router.route("/signup").post(upload.single("avatar"), signupValidator, signup);

router.route("/:email/verify/:token").post(verifyEmailValidator, verifyEmail);

router
  .route("/resend-verification/:email")
  .post(resendVerificationTokenValidator, resendVerificationToken);

router.route("/signin").post(signinValidator, signin);

router.route("/signout").post(isAuthenticated, signout);

export default router;
