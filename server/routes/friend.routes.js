import express from "express";
import {
  acceptFriendRequest,
  getFriends,
  getPendingFriendRequests,
  rejectFriendRequest,
  sendFriendRequest,
} from "../controllers/friend.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/send").post(isAuthenticated, sendFriendRequest);

router.route("/accept").post(isAuthenticated, acceptFriendRequest);

router.route("/reject").post(isAuthenticated, rejectFriendRequest);

router.route("/:userId").get(isAuthenticated, getFriends);

router.route("/pending").get(isAuthenticated, getPendingFriendRequests);

router.route("/pending/:userId").get(isAuthenticated, getPendingFriendRequests);

export default router;
