import Joi from "joi";

export const getUserSchema = Joi.object({
  username: Joi.string().optional(),
  fullname: Joi.string().optional(),
  email: Joi.string().email().optional(),
  id: Joi.string().optional(),
});

export const getUserByIdSchema = Joi.object({
  userId: Joi.string().required(),
});

export const getUserByUsernameSchema = Joi.object({
  username: Joi.string().required(),
});

export const searchUsersSchema = Joi.object({
  keyword: Joi.string().required(),
});

export const changeAvatarSchema = Joi.object({
  userId: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  userId: Joi.string().required(),
  fullname: Joi.string().optional(),
  username: Joi.string().optional(),
  bio: Joi.string().optional(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});

export const resendResetPasswordTokenSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
});
