import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  getUsers,
  getUserById,
  getUserByUsername,
  searchUsers,
} from "../controllers/user.controllers.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getUsers);

router.route("/:userId").get(isAuthenticated, getUserById);

router.route("/u/:username").get(isAuthenticated, getUserByUsername);

router.route("/search").get(isAuthenticated, searchUsers);

export default router;
