const Joi = require("joi")

const bikeinfoSchema = Joi.object({
    bike_category_id:Joi.number(),
    shop_id:Joi.number(),
    bike_name:Joi.string(),
    specs:Joi.string(),
    rent_price:Joi.number(),
    availability:Joi.boolean(),
    user_id:Joi.number()
})

module.exports = bikeinfoSchema