import express from "express";
import { toggleLike } from "../controllers/like.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(isAuthenticated, toggleLike);

export default router;
