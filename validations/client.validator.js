const Joi = require("joi")

const clientSchema = Joi.object({
    client_code:Joi.string().required(),
    avatar:Joi.string(),
    client_name:Joi.string().required(),
    email_address:Joi.string().required(),
    contact_number:Joi.string().required(),
    complete_address:Joi.string(),
    username:Joi.string().required(),
    password:Joi.string().required(),
    status:Joi.boolean()
})

module.exports = clientSchema