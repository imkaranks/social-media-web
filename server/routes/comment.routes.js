import express from "express";
import {
  createComment,
  getComments,
  getCommentsByUser,
  getCommentsByPostId,
  deleteComment,
} from "../controllers/comment.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createCommentValidator,
  deleteCommentValidator,
  getCommentsByPostIdValidator,
  getCommentsByUserValidator,
  getCommentValidator,
} from "../validations/middlewares/comment.middlewares.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getCommentValidator, getComments);

router
  .route("/user")
  .get(isAuthenticated, getCommentsByUserValidator, getCommentsByUser);

router
  .route("/:postId")
  .get(isAuthenticated, getCommentsByPostIdValidator, getCommentsByPostId);

router
  .route("/create/:postId")
  .post(isAuthenticated, createCommentValidator, createComment);

router
  .route("/:commentId")
  .delete(isAuthenticated, deleteCommentValidator, deleteComment);

export default router;
