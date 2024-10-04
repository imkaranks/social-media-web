const formatValidatorErrors = (error) => {
  // const requiredFields = error.details
  //   .filter((detail) => detail.type === "any.required")
  //   .map((detail) => detail.context.label);

  // // Format the error messages
  // const formattedMessages = requiredFields.length
  //   ? `${requiredFields.join(", ")} ${requiredFields.length === 1 ? "is" : "are"} required`
  //   : "Validation error";

  let errorMessage = "";

  // Group errors by type
  const errorsGroup = error.details.reduce((acc, detail) => {
    const type = detail.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(detail);
    return acc;
  }, {});

  const errorsGroupLength = Object.keys(errorsGroup).length;
  let i = 0;

  // Iterate over grouped errors
  for (const type in errorsGroup) {
    const errors = errorsGroup[type];
    const errorsLength = errors.length;

    if (errorsLength > 1) {
      // Collect field paths except the last one
      const fieldsExceptLast = errors
        .slice(0, errorsLength - 1)
        .map((error) => error.path.join("."));
      const lastField = errors.slice(-1)[0].path.join(".");
      const restMessage = errors[0].message.split(errors[0].path.join("."))[1];

      // Construct the error message
      errorMessage += `${fieldsExceptLast.join(", ")} and ${lastField}${restMessage}`;
    } else {
      // Handle single error cases
      errorMessage += errors[0].message;
    }

    // Add a separator for multiple error types, if applicable
    if (errorsGroupLength > 1 && i < errorsGroupLength - 1) {
      errorMessage += "; ";
    }

    i++;
  }

  return errorMessage;
};

export default formatValidatorErrors;
