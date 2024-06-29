import express from "express";
import {
  createPost,
  getAllPosts,
  getPostsByUserId,
  getPostById,
  getPostsByUsername,
  updatePost,
  deletePost,
} from "../controllers/post.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router
  .route("/create")
  .post(isAuthenticated, upload.array("images", 5), createPost);

router.route("/").get(isAuthenticated, getAllPosts);

router.route("/id/:userId").get(isAuthenticated, getPostsByUserId);

router.route("/user/:username").get(isAuthenticated, getPostsByUsername);

router
  .route("/:postId")
  .get(isAuthenticated, getPostById)
  .patch(isAuthenticated, upload.array("images", 5), updatePost)
  .delete(isAuthenticated, deletePost);

export default router;
