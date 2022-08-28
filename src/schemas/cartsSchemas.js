import Joi from 'joi'

const schemaNewCart = Joi.object(
    {
        id: Joi.string()
            .required(),
    }
)

export default schemaNewCart;