import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";
import Conversation from "../models/conversation.model.js";
import handleAsyncError from "../utils/handleAsyncError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const sendFriendRequest = handleAsyncError(async (req, res) => {
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
    throw new ApiError(400, "Friend request already pending");
  }

  const newFriend = await Friend.create({
    user1: senderId,
    user2: recipientId,
  });

  res.status(200).json(new ApiResponse(200, newFriend, "Friend request sent"));
});

export const acceptFriendRequest = handleAsyncError(async (req, res) => {
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

export const rejectFriendRequest = handleAsyncError(async (req, res) => {
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

export const getFriends = handleAsyncError(async (req, res) => {
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

  res.status(200).json(new ApiResponse(200, friends));
});

export const getPendingFriendRequests = handleAsyncError(async (req, res) => {
  const userId = req?.user?._id || req.params.userId;

  const pendingRequestsSent = await Friend.find({
    user1: userId,
    status: "pending",
  }).populate({
    path: "user2",
    model: User,
    select: "_id avatar username fullname",
  });

  const pendingRequestsReceived = await Friend.find({
    user2: userId,
    status: "pending",
  }).populate({
    path: "user1",
    model: User,
    select: "_id avatar username fullname",
  });

  const pendingRequestsData = {
    sent: await formatPendingRequests(userId, pendingRequestsSent),
    received: await formatPendingRequests(userId, pendingRequestsReceived),
  };

  res.status(200).json(new ApiResponse(200, pendingRequestsData));
});

async function formatPendingRequests(userId, pendingRequests) {
  const formattedRequests = await Promise.all(
    pendingRequests.map(async (pendingRequest) => {
      const senderId = pendingRequest.user1._id;
      const mutualFriendsCount = await getMutualFriendsCount(userId, senderId);
      return {
        _id: pendingRequest._id,
        sender: pendingRequest.user1,
        receiver: pendingRequest.user2,
        mutualFriendsCount,
      };
    })
  );
  return formattedRequests;
}

export async function getMutualFriendsCount(userId1, userId2) {
  try {
    const friendsOfUser1 = await getAcceptedFriends(userId1);
    const friendsOfUser2 = await getAcceptedFriends(userId2);

    const mutualFriends = friendsOfUser1.filter((friend1) =>
      friendsOfUser2.some(
        (friend2) => friend1.toString() === friend2.toString()
      )
    );

    return mutualFriends.length;
  } catch (error) {
    console.error("Error fetching mutual friends:", error);
    return 0;
  }
}

async function getAcceptedFriends(userId) {
  const friends = await Friend.find({
    $or: [
      { user1: userId, status: "accepted" },
      { user2: userId, status: "accepted" },
    ],
  });

  return friends.flatMap((friend) => {
    const friendId =
      friend.user1.toString() === userId.toString()
        ? friend.user2.toString()
        : friend.user1.toString();
    return friendId;
  });
}
