import Joi from "joi";
/*
savePost (
const { userId, postId } = req.params;
)

getSavedPost (
const { userId } = req.params;
)

deleteSavedPost (
const { savedPostId } = req.params;
)
*/

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
