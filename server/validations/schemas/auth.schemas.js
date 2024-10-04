import Joi from "joi";

export const signupSchema = Joi.object({
  fullname: Joi.string().min(1).max(100).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  avatar: Joi.optional(),
});

export const verifyEmailSchema = Joi.object({
  email: Joi.string().email().required(),
  token: Joi.string().required(),
});

export const resendVerificationTokenSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const signinSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
