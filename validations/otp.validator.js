const Joi = require("joi")

const otpSchema = Joi.object({
    otp:Joi.string().required(),
    expiration_time:Joi.date().required(),
    verified:Joi.boolean()
})

module.exports = otpSchema