// import Post from "../models/post.model.js";
// import User from "../models/user.model.js";
// import Comment from "../models/comment.model.js";
import Notification from "../models/notification.model.js";
import handleAsyncError from "../utils/handleAsyncError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

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
  });

  const populatedNotifications = await Promise.all(
    notifications.map(async (n) => {
      const type = n.type.toLowerCase();

      switch (type) {
        case "post":
          return await Notification.findById(n._id).populate({
            path: "relatedPost",
            select: "title content author",
            populate: {
              path: "author",
              select: "username fullname avatar",
            },
          });

        // TODO: pending in use
        case "like":
          return await Notification.findById(n._id).populate({
            path: "relatedLike",
            model: "Like",
            select: "user",
            populate: {
              path: "user",
              select: "username fullname avatar",
            },
          });

        case "comment":
        case "reply":
          return await Notification.findById(n._id).populate({
            path: "relatedComment",
            model: "Comment",
            select: "user",
            populate: {
              path: "user",
              select: "username fullname avatar",
            },
          });

        // TODO: pending in use
        case "friend_request_sent":
          return await Notification.findById(n._id).populate({
            path: "relatedFriend",
            model: "Friend",
            select: "user1",
            populate: {
              path: "user1",
              select: "username fullname avatar",
            },
          });

        case "friend_request_accepted":
          return await Notification.findById(n._id).populate({
            path: "relatedFriend",
            model: "Friend",
            select: "user2",
            populate: {
              path: "user2",
              select: "username fullname avatar",
            },
          });

        default:
          return null;
      }
    })
  );

  res
    .status(200)
    .json(new ApiResponse(200, populatedNotifications || [], "Success"));
});
