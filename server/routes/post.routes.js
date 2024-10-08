import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  searchPosts,
} from "../controllers/post.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  createPostValidator,
  deletePostValidator,
  getPostByIdValidator,
  getPostsValidator,
  searchPostsValidator,
  updatePostValidator,
} from "../validations/middlewares/post.middlewares.js";

const router = express.Router();

router
  .route("/create")
  .post(
    isAuthenticated,
    upload.array("images", 5),
    createPostValidator,
    createPost
  );

router.route("/").get(isAuthenticated, getPostsValidator, getPosts);

router.route("/search").get(isAuthenticated, searchPostsValidator, searchPosts);

router
  .route("/:postId")
  .get(isAuthenticated, getPostByIdValidator, getPostById)
  .patch(
    isAuthenticated,
    upload.array("images", 5),
    updatePostValidator,
    updatePost
  )
  .delete(isAuthenticated, deletePostValidator, deletePost);

export default router;
