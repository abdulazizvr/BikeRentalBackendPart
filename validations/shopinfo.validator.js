const Joi = require("joi")

const shopinfoSchema = Joi.object({
    shop_name:Joi.string().required(),
    owner_name:Joi.string().required(),
    address:Joi.string().required(),
    email_address:Joi.string().required(),
    contact_no:Joi.string(),
    website:Joi.string().required(),
    updated_by:Joi.number()
})

module.exports = shopinfoSchema