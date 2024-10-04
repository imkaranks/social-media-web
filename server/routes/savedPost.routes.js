import express from "express";
import {
  deleteSavedPost,
  getSavedPost,
  savePost,
} from "../controllers/savedPost.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  deleteSavedPostValidator,
  getSavedPostValidator,
  savePostValidator,
} from "../validations/middlewares/savedPost.middlewares.js";

const router = express.Router();

router
  .route("/:postId/:userId")
  .post(isAuthenticated, savePostValidator, savePost);

router
  .route("/:userId")
  .get(isAuthenticated, getSavedPostValidator, getSavedPost);

router
  .route("/:savedPostId")
  .delete(isAuthenticated, deleteSavedPostValidator, deleteSavedPost);

export default router;
