import express from "express";
import { getLikes, toggleLike } from "../controllers/like.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  getLikesValidator,
  toggleLikeValidator,
} from "../validations/middlewares/like.middlewares.js";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, toggleLikeValidator, toggleLike)
  .get(isAuthenticated, getLikesValidator, getLikes);

export default router;
