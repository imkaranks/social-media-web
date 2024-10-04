import express from "express";
import {
  getUser,
  getUsers,
  getUserById,
  getUserByUsername,
  searchUsers,
  updateUser,
  changeAvatar,
  updateUserLastSeen,
  changePassword,
  forgotPassword,
  resetPassword,
  resendResetPasswordToken,
} from "../controllers/user.controllers.js";
import upload from "../middlewares/multer.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  changeAvatarValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  getUserByIdValidator,
  getUserByUsernameValidator,
  getUserValidator,
  resendResetPasswordTokenValidator,
  resetPasswordValidator,
  searchUsersValidator,
  updateUserValidator,
} from "../validations/middlewares/user.middlewares.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getUsers);

router
  .route("/avatar/:userId")
  .patch(
    isAuthenticated,
    upload.single("avatar"),
    changeAvatarValidator,
    changeAvatar
  );

router.route("/profile").get(isAuthenticated, getUserValidator, getUser);

router.route("/search").get(isAuthenticated, searchUsersValidator, searchUsers);

router
  .route("/change-password")
  .patch(isAuthenticated, changePasswordValidator, changePassword);

router.route("/forgot-password").post(forgotPasswordValidator, forgotPassword);

router.route("/reset-password").post(resetPasswordValidator, resetPassword);

router
  .route("/resend-reset-token")
  .post(resendResetPasswordTokenValidator, resendResetPasswordToken);

router
  .route("/:userId")
  .get(isAuthenticated, getUserByIdValidator, getUserById)
  .patch(
    isAuthenticated,
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "banner", maxCount: 1 },
    ]),
    updateUserValidator,
    updateUser
  );

router
  .route("/u/:username")
  .get(isAuthenticated, getUserByUsernameValidator, getUserByUsername);

router.route("/update-last-seen").post(isAuthenticated, updateUserLastSeen);

export default router;
