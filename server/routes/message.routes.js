import express from "express";
import {
  getMessages,
  sendMessage,
  markAsRead,
} from "../controllers/message.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated, sendMessage);

router
  .route("/:id")
  .get(isAuthenticated, getMessages)
  .patch(isAuthenticated, markAsRead);

export default router;
