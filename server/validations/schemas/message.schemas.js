import Joi from "joi";
/*
sendMessage (
const { message } = req.body;
  const sender = req.user._id;
  const { id: receiver } = req.params;
)

getMessages (
const sender = String(req.user._id);
  const { id: receiver } = req.params;
  const { page = 1, limit = 10 } = req.query;
)
*/

export const sendMessageSchema = Joi.object({
  message: Joi.string().required(),
  id: Joi.string().required(),
});

export const getMessagesSchema = Joi.object({
  id: Joi.string().required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
});
