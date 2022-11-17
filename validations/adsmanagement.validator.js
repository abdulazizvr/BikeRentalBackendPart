const Joi = require("joi")

const adsmanagementSchema = Joi.object({
    ad_name:Joi.string(),
    shop_id:Joi.number(),
    banner_image:Joi.string(),
    description:Joi.string(),
    start_date:Joi.date(),
    end_date:Joi.date().required(),
    ad_location:Joi.boolean(),
    amount:Joi.number().required(),
    user_id:Joi.number()
})

module.exports = adsmanagementSchema