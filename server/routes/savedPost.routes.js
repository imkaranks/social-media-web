import express from "express";
import {
  deleteSavedPost,
  getSavedPost,
  savePost,
} from "../controllers/savedPost.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/:postId/:userId").post(isAuthenticated, savePost);

router.route("/:userId").get(isAuthenticated, getSavedPost);

router.route("/:savedPostId").delete(isAuthenticated, deleteSavedPost);

export default router;
