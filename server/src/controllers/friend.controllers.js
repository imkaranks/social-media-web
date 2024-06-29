import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";
import Conversation from "../models/conversation.model.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const sendFriendRequest = catchAsyncError(async (req, res) => {
  const { senderId, recipientId } = req.body;

  if (!senderId.trim() || !recipientId.trim()) {
    throw new ApiError(404, "Both senderId and recipientId must be provided");
  }

  if (req?.user?.id === recipientId) {
    throw new ApiError(400, "You cannot send a friend request to yourself");
  }

  if (req?.user?.id !== senderId) {
    throw new ApiError(
      403,
      "You are not permitted to send a friend request on behalf of someone else"
    );
  }

  const sender = await User.findById(senderId);
  const recipient = await User.findById(recipientId);

  if (!sender || !recipient) {
    throw new ApiError(404, "Sender or recipient not found");
  }

  const existingFriend = await Friend.findOne({
    $or: [
      { user1: senderId, user2: recipientId },
      { user2: senderId, user1: recipientId },
    ],
  });

  if (existingFriend) {
    throw new ApiError(400, "Friend request already sent");
  }

  const newFriend = await Friend.create({
    user1: senderId,
    user2: recipientId,
  });

  res.status(200).json(new ApiResponse(200, newFriend, "Friend request sent"));
});

export const acceptFriendRequest = catchAsyncError(async (req, res) => {
  const { userId, requestId } = req.body;

  if (!userId.trim() || !requestId.trim()) {
    throw new ApiError(404, "Both userId and requestId must be provided");
  }

  if (req?.user?.id !== userId) {
    throw new ApiError(
      403,
      "You are not permitted to accept a friend request on behalf of someone else"
    );
  }

  const friendRequest = await Friend.findOne({
    _id: requestId,
    user2: userId,
    status: "pending",
  });

  if (!friendRequest) {
    throw new ApiError(404, "Friend request not found");
  }

  friendRequest.status = "accepted";
  await friendRequest.save();

  res
    .status(200)
    .json(new ApiResponse(200, friendRequest, "Friend request accepted"));
});

export const rejectFriendRequest = catchAsyncError(async (req, res) => {
  const { userId, requestId } = req.body;

  if (!userId.trim() || !requestId.trim()) {
    throw new ApiError(404, "Both userId and requestId must be provided");
  }

  if (req?.user?.id !== userId) {
    throw new ApiError(
      403,
      "You are not permitted to reject a friend request on behalf of someone else"
    );
  }

  const friendRequest = await Friend.findOne({
    _id: requestId,
    user2: userId,
    status: "pending",
  });

  if (!friendRequest) {
    throw new ApiError(404, "Friend request not found");
  }

  friendRequest.status = "rejected";
  await friendRequest.save();

  res
    .status(200)
    .json(new ApiResponse(200, friendRequest, "Friend request rejected"));
});

export const getFriends = catchAsyncError(async (req, res) => {
  const { userId } = req.params;

  if (!userId.trim()) {
    throw new ApiError(404, "userId must be provided");
  }

  const friendships = await Friend.find({
    $or: [{ user1: userId }, { user2: userId }],
    status: "accepted",
  });

  const friendIds = friendships.map((friend) => {
    return friend.user1.toString() === userId ? friend.user2 : friend.user1;
  });

  const friends = await User.find({ _id: { $in: friendIds } }).select(
    "-password -refreshToken"
  );

  // Retrieve last messages for each friend
  const friendsWithLastMessages = await Promise.all(
    friends.map(async (friend) => {
      const conversation = await Conversation.findOne({
        participants: { $all: [userId, friend._id] },
      })
        .limit(1)
        .populate("messages");

      const lastMessage = conversation
        ? conversation.messages[conversation.messages.length - 1]
        : null;

      return {
        ...friend.toObject(),
        lastMessage,
      };
    })
  );

  res.status(200).json(new ApiResponse(200, friendsWithLastMessages));
});

export const getPendingFriendRequests = catchAsyncError(async (req, res) => {
  const userId = req?.user?._id || req.params.userId;

  const pendingRequests = await Friend.find({
    user2: userId,
    status: "pending",
  }).populate({
    path: "user1",
    model: "User",
    select: "-password -refreshToken",
  });

  // Array to hold pending requests with mutual friends count
  const pendingRequestsData = await Promise.all(
    pendingRequests.map(async (pendingRequest) => {
      const senderId = pendingRequest.user1._id;

      // Find mutual friends count
      const mutualFriendsCount = await getMutualFriendsCount(userId, senderId);

      return {
        _id: pendingRequest._id,
        sender: pendingRequest.user1,
        mutualFriendsCount,
      };
    })
  );

  res.status(200).json(new ApiResponse(200, pendingRequestsData));
});

async function getMutualFriendsCount(userId1, userId2) {
  try {
    // Find all friends of userId1
    const friendsOfUser1 = await Friend.find({
      $or: [
        { user1: userId1, status: "accepted" },
        { user2: userId1, status: "accepted" },
      ],
    });

    // Find all friends of userId2
    const friendsOfUser2 = await Friend.find({
      $or: [
        { user1: userId2, status: "accepted" },
        { user2: userId2, status: "accepted" },
      ],
    });

    // Extract user ids from each set of friends
    const friendsIdsUser1 = friendsOfUser1.map((friend) =>
      friend.user1.toString() === userId1.toString()
        ? friend.user2.toString()
        : friend.user1.toString()
    );
    const friendsIdsUser2 = friendsOfUser2.map((friend) =>
      friend.user1.toString() === userId2.toString()
        ? friend.user2.toString()
        : friend.user1.toString()
    );

    // Calculate mutual friends by finding intersection of friends lists
    const mutualFriends = friendsIdsUser1.filter((friendId) =>
      friendsIdsUser2.includes(friendId)
    );

    return mutualFriends.length;
  } catch (error) {
    console.error("Error fetching mutual friends:", error);
    return 0; // Handle error gracefully
  }
}
