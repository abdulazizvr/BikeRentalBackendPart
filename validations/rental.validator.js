const Joi = require("joi")

const rentalSchema = Joi.object({
    bike_id:Joi.number(),
    client_id:Joi.number(),
    rental_start_date:Joi.date(),
    rental_end_date:Joi.date().required(),
    total_amount:Joi.number(),
    payment_status:Joi.boolean(),
    rental_status:Joi.boolean(),
    remarks:Joi.string().required(),
    user_id:Joi.number()
})

module.exports = rentalSchema