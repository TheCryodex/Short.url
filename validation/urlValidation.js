const joi = require('joi');


const schema = joi.object({
  alias : joi.string().trim().pattern(new RegExp(('[a-z0-9_]{1,5}'))).allow('').optional(),
  url : joi.string().trim().uri().required(),
});


module.exports = schema;
