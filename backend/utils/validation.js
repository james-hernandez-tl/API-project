const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);
  // console.log("valdi",validationErrors)
  if (!validationErrors.isEmpty()) {
    // console.log("valid",validationErrors)
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    // console.log("errorsdafda",errors)
    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

module.exports = {
  handleValidationErrors
};
