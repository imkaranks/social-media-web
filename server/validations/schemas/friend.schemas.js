import Joi from "joi";

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
