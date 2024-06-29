import express from "express";
import {
  getMessages,
  sendMessage,
} from "../controllers/message.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/:id").get(isAuthenticated, getMessages);
router.route("/send/:id").post(isAuthenticated, sendMessage);

export default router;
