import express from "express";
import { getNotifications } from "../controllers/notification.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { getNotificationsValidator } from "../validations/middlewares/notification.middlewares.js";

const router = express.Router();

router
  .route("/:userId")
  .get(isAuthenticated, getNotificationsValidator, getNotifications);

export default router;
