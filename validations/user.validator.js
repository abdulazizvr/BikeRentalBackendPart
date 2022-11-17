const Joi = require("joi")

const userShchema = Joi.object({
    username:Joi.string().required(),
    password:Joi.string().required(),
    avatar:Joi.string(),
    fullname:Joi.string().required(),
    contact:Joi.string(),
    email:Joi.string().email().required(),
    user_category_id:Joi.number(),
    status:Joi.boolean()
})

module.exports = userShchema