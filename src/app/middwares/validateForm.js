const { body, validationResult } = require('express-validator');

const validateUserData = [
  body('name').notEmpty().withMessage('Name is required'),
  body('gender').notEmpty().withMessage('Gender is required'),
  body('email').isEmail().withMessage('Email is not valid'),
  body('phone').isMobilePhone('vi-VN').withMessage('Phone number is not valid'),
  body('address').notEmpty().withMessage('Address is required'),
  body('changePass').isBoolean().withMessage('Change password is not valid'),
  body('passNow').if(body('changePass').equals(true)).notEmpty().withMessage('Current password is required'),
  body('passNew').if(body('changePass').equals(true)).notEmpty().withMessage('New password is required'),
  body('passNewPre').if(body('changePass').equals(true)).notEmpty().withMessage('Please confirm new password'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
      errors: extractedErrors,
    });
  },
];

module.exports = validateUserData;
