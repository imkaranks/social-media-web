import Joi from "joi";

export const sendMessageSchema = Joi.object({
  message: Joi.string().required(),
  id: Joi.string().required(),
});

export const getMessagesSchema = Joi.object({
  id: Joi.string().required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
});
