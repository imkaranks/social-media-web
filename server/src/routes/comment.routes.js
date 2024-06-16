import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createComment,
  getAllComments,
  getCommentsByUserId,
  getCommentsByUsername,
  deleteComment,
} from "../controllers/comment.controllers.js";

const router = express.Router();

router.route("/:postId").get(isAuthenticated, getAllComments);

router.route("/user/:userId").get(isAuthenticated, getCommentsByUserId);

router.route("/user/u/:username").get(isAuthenticated, getCommentsByUsername);

router.route("/create/:postId").post(isAuthenticated, createComment);

router.route("/:commentId").delete(isAuthenticated, deleteComment);

export default router;
