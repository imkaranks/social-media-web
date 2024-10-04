import express from "express";
import {
  getMessages,
  sendMessage,
  markAsRead,
} from "../controllers/message.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  getMessagesValidator,
  sendMessageValidator,
} from "../validations/middlewares/message.middlewares.js";

const router = express.Router();

router
  .route("/send/:id")
  .post(isAuthenticated, sendMessageValidator, sendMessage);

router
  .route("/:id")
  .get(isAuthenticated, getMessagesValidator, getMessages)
  .patch(isAuthenticated, markAsRead);

export default router;
