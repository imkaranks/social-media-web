import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
} from "../controllers/post.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router
  .route("/create")
  .post(isAuthenticated, upload.array("images", 5), createPost);

router.route("/").get(isAuthenticated, getAllPosts);

router.route("/:postId").delete(isAuthenticated, deletePost);

export default router;
