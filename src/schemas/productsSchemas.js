import Joi from 'joi'

const schemaNewProduct = Joi.object(
    {
        name: Joi.string()
            .required(),
        description: Joi.string()
            .required(),
        price: Joi.number()
            .precision(2)
            .positive()
            .required(),
        image: Joi.string()
            .required(),
    }
)

export default schemaNewProduct;
