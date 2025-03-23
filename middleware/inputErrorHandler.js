const { validationResult } = require('express-validator');

module.exports.inputErrorHandler = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const missingInputs = result.array().map((r) => r.path).join(', ')
    const error = `${missingInputs} ${missingInputs.length > 0 ? 'are' : 'is'} missing`
    res.status(400).json({ message: error });
    return 
  }
  next()
};


