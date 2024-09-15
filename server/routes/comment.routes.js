import express from "express";
import {
  createComment,
  getComments,
  getCommentsByUser,
  getCommentsByPostId,
  deleteComment,
} from "../controllers/comment.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getComments);

router.route("/user").get(isAuthenticated, getCommentsByUser);

router.route("/:postId").get(isAuthenticated, getCommentsByPostId);

router.route("/create/:postId").post(isAuthenticated, createComment);

router.route("/:commentId").delete(isAuthenticated, deleteComment);

export default router;
