import Joi from "joi";
/*
sendFriendRequest (
const { senderId, recipientId } = req.body;
)

acceptFriendRequest (
const { userId, requestId } = req.body;
)

rejectFriendRequest (
const { userId, requestId } = req.body;
)

removeExistingFriend (
  const { friendId } = req.params;
  const userId = req.user._id;

  if (!friendId.trim() || friendId === String(userId)) {
    throw new ApiError(400, "friendId must be provided");
  }
)

getFriends (
const { userId } = req.params;
)

getPendingFriendRequests (
const userId = req?.user?._id || req.params.userId;
)

getFriendRecommendations (
const { user } = req.params;
  const { limit = 5 } = req.query;
)
*/

export const sendFriendRequestSchema = Joi.object({
  senderId: Joi.string().required(),
  recipientId: Joi.string().required(),
});

export const acceptFriendRequestSchema = Joi.object({
  userId: Joi.string().required(),
  requestId: Joi.string().required(),
});

export const rejectFriendRequestSchema = Joi.object({
  userId: Joi.string().required(),
  requestId: Joi.string().required(),
});

export const removeExistingFriendSchema = Joi.object({
  friendId: Joi.string().required(),
}).required();

export const getFriendsSchema = Joi.object({
  userId: Joi.string().required(),
});

export const getPendingFriendRequestsSchema = Joi.object({
  userId: Joi.string().required(),
});

export const getFriendRecommendationsSchema = Joi.object({
  user: Joi.string().required(),
  limit: Joi.number().integer().min(1).max(100).default(5),
});
