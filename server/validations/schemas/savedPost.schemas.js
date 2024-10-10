import Joi from "joi";

export const savePostSchema = Joi.object({
  userId: Joi.string().required(),
  postId: Joi.string().required(),
});

export const getSavedPostSchema = Joi.object({
  userId: Joi.string().required(),
});

export const deleteSavedPostSchema = Joi.object({
  savedPostId: Joi.string().required(),
});
