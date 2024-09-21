import express from "express";
import {
  acceptFriendRequest,
  getFriendRecommendations,
  getFriends,
  getMutualFriends,
  getPendingFriendRequests,
  rejectFriendRequest,
  removeExistingFriend,
  sendFriendRequest,
} from "../controllers/friend.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  acceptFriendRequestValidator,
  getFriendRecommendationsValidator,
  getFriendsValidator,
  getPendingFriendRequestsValidator,
  rejectFriendRequestValidator,
  removeExistingFriendValidator,
  sendFriendRequestValidator,
} from "../validations/middlewares/friend.middlewares.js";

const router = express.Router();

router
  .route("/send")
  .post(isAuthenticated, sendFriendRequestValidator, sendFriendRequest);

router
  .route("/accept")
  .post(isAuthenticated, acceptFriendRequestValidator, acceptFriendRequest);

router
  .route("/reject")
  .post(isAuthenticated, rejectFriendRequestValidator, rejectFriendRequest);

router
  .route("/remove/:friendId")
  .post(isAuthenticated, removeExistingFriendValidator, removeExistingFriend);

router
  .route("/pending")
  .get(
    isAuthenticated,
    getPendingFriendRequestsValidator,
    getPendingFriendRequests
  );

router
  .route("/pending/:userId")
  .get(
    isAuthenticated,
    getPendingFriendRequestsValidator,
    getPendingFriendRequests
  );

router.route("/:user1/mutual/:user2").get(isAuthenticated, getMutualFriends);

router
  .route("/mutual-suggestion/:user")
  .get(
    isAuthenticated,
    getFriendRecommendationsValidator,
    getFriendRecommendations
  );

router.route("/:userId").get(isAuthenticated, getFriendsValidator, getFriends);

export default router;
