import Joi from 'joi'

export const schema = Joi.object({
    firstname: Joi.string().min(1).required(),
    lastname: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required(),
})