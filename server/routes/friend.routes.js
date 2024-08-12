import express from "express";
import {
  acceptFriendRequest,
  getFriendRecommendations,
  getFriends,
  getMutualFriends,
  getPendingFriendRequests,
  rejectFriendRequest,
  sendFriendRequest,
} from "../controllers/friend.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/send").post(isAuthenticated, sendFriendRequest);

router.route("/accept").post(isAuthenticated, acceptFriendRequest);

router.route("/reject").post(isAuthenticated, rejectFriendRequest);

router.route("/pending").get(isAuthenticated, getPendingFriendRequests);

router.route("/pending/:userId").get(isAuthenticated, getPendingFriendRequests);

router.route("/:user1/mutual/:user2").get(isAuthenticated, getMutualFriends);

router
  .route("/mutual-suggestion/:user")
  .get(isAuthenticated, getFriendRecommendations);

router.route("/:userId").get(isAuthenticated, getFriends);

export default router;
