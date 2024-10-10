import Joi from "joi";

export const getNotificationsSchema = Joi.object({
  userId: Joi.string().required(),
});
