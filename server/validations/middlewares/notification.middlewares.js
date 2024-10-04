import ApiError from "../../utils/ApiError.js";
import formatValidatorErrors from "../../utils/formatValidatorErrors.js";
import { getNotificationsSchema } from "../schemas/notification.schemas.js";

export function getNotificationsValidator(req, res, next) {
  const { error } = getNotificationsSchema.validate(req.params, {
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
