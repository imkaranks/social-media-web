import express from "express";
import {
  getUser,
  getUsers,
  getUserById,
  getUserByUsername,
  searchUsers,
  updateUser,
  changeAvatar,
  updateUserLastSeen,
} from "../controllers/user.controllers.js";
import upload from "../middlewares/multer.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getUsers);

router
  .route("/avatar/:userId")
  .patch(isAuthenticated, upload.single("avatar"), changeAvatar);

router.route("/profile").get(isAuthenticated, getUser);

router
  .route("/:userId")
  .get(isAuthenticated, getUserById)
  .patch(isAuthenticated, updateUser);

router.route("/u/:username").get(isAuthenticated, getUserByUsername);

router.route("/search").get(isAuthenticated, searchUsers);

router.route("/update-last-seen").post(isAuthenticated, updateUserLastSeen);

export default router;
