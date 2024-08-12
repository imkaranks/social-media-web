import express from "express";
import { getNotifications } from "../controllers/notification.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/:userId").get(isAuthenticated, getNotifications);

export default router;
