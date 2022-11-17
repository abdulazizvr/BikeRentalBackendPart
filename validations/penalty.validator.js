const Joi = require("joi")

const penaltySchema = Joi.object({ 
    rental_id:Joi.number().required(),
    penalty_amount:Joi.number().required(),
    payment_status:Joi.boolean(),
    remarks:Joi.string(),
    paid_by:Joi.string().required(),
    user_id:Joi.number()  
})

module.exports = penaltySchema