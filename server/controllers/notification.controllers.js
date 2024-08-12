import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import handleAsyncError from "../utils/handleAsyncError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Notification from "../models/notification.model.js";
import { getSocketId, io } from "../socket/socket.js";

export const getNotifications = handleAsyncError(async (req, res) => {
  const { userId } = req.params;

  if (!userId.trim()) {
    throw new ApiError(400, "userId must be provided");
  }

  if (userId !== String(req.user._id)) {
    throw new ApiError(403, "You are not permitted to access this resource");
  }

  const notifications = await Notification.find({
    user: req.user._id,
  })
    // .populate({
    //   path: "user",
    //   select: "_id username fullname avatar",
    // })
    .populate({
      path: "relatedComment",
      model: "Comment",
      select: "user",
      populate: { path: "user", select: "_id username fullname avatar" },
    });

  res.status(200).json(new ApiResponse(200, notifications || [], "Success"));
});
