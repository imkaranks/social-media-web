import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "POST",
        "LIKE",
        "COMMENT",
        "REPLY",
        "FRIEND_REQUEST_SENT",
        "FRIEND_REQUEST_ACCEPTED",
      ],
      required: true,
    },
    relatedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    relatedLike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Like",
    },
    relatedComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    relatedFriend: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Friend",
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
