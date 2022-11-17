const Joi = require("joi")

const paymentSchema = Joi.object({
    rental_id:Joi.number().required(),
    payment_type:Joi.number().min(0).max(3),
    paid_by:Joi.string().required(),
    payment_date:Joi.date(),
    remarks:Joi.string().required(),
    user_id:Joi.number()
})

module.exports = paymentSchema