const Joi = require("joi")

const bikecategorySchema = Joi.object({
    category_name:Joi.string().required(),
    description:Joi.string().required()
})

module.exports = bikecategorySchema