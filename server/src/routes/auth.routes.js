import express from "express";
import {
  refreshAccessToken,
  signin,
  signout,
  signup,
} from "../controllers/auth.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/refresh").get(refreshAccessToken);
router.route("/signin").post(signin);
router.route("/signup").post(signup);
router.route("/signout").post(isAuthenticated, signout);

export default router;
