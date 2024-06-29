import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { toggleLike } from "../controllers/like.controllers.js";

const router = express.Router();

router.route("/").post(isAuthenticated, toggleLike);

export default router;
