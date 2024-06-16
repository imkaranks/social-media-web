import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  acceptFriendRequest,
  getFriends,
  getPendingFriendRequests,
  rejectFriendRequest,
  sendFriendRequest,
} from "../controllers/friend.controllers.js";

const router = express.Router();

router.post("/send", isAuthenticated, sendFriendRequest);

router.post("/accept", isAuthenticated, acceptFriendRequest);

router.post("/reject", isAuthenticated, rejectFriendRequest);

router.get("/:userId", isAuthenticated, getFriends);

router.get("/pending", isAuthenticated, getPendingFriendRequests);
router.get("/pending/:userId", isAuthenticated, getPendingFriendRequests);

export default router;
