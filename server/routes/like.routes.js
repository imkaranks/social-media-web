import express from "express";
import { getLikes, toggleLike } from "../controllers/like.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, toggleLike)
  .get(isAuthenticated, getLikes);

export default router;
