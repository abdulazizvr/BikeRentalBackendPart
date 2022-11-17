const Joi = require("joi")

const tokenSchema = Joi.object({
    table_name:Joi.string(),
    user_id:Joi.number().required(),
    user_os:Joi.string(),
    user_device:Joi.string().required(),
    token:Joi.string().required()
})

module.exports = tokenSchema