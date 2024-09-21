import Joi from "joi";
/*
getNotifications (
const { userId } = req.params;
)
*/

export const getNotificationsSchema = Joi.object({
  userId: Joi.string().required(),
});
