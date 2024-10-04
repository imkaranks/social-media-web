import ApiError from "../../utils/ApiError.js";
import formatValidatorErrors from "../../utils/formatValidatorErrors.js";
import {
  getMessagesSchema,
  sendMessageSchema,
} from "../schemas/message.schemas.js";

export function sendMessageValidator(req, res, next) {
  const payload = { ...req.body, ...req.params };

  const { error } = sendMessageSchema.validate(payload, {
    abortEarly: false,
  });

  if (error)
    throw new ApiError(
      400,
      formatValidatorErrors(error),
      error.details.map((detail) => detail.message)
    );

  next();
}

export function getMessagesValidator(req, res, next) {
  const payload = { ...req.query, ...req.params };

  const { error } = getMessagesSchema.validate(payload, {
    abortEarly: false,
  });

  if (error)
    throw new ApiError(
      400,
      formatValidatorErrors(error),
      error.details.map((detail) => detail.message)
    );

  next();
}
