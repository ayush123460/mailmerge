const Joi = require('joi')

const codeSchema = Joi.object({
    code: Joi.string().required()
})

module.exports = {
    codeSchema
}