import schemaNewCart from '../schemas/cartsSchemas.js'
import logger from '../logger.js'

export async function mdwValidateSchemaNewCart(req, res) {
    try {
        await schemaNewCart.validateAsync(req.id)
    }
    catch (err) {
        logger.warn(`Error al validar el esquema de carts - Error: ${err}`, err)
        return res.status(400).json({ descripcion: `Error al validar el esquema de carts - Error: ${err}` })
    }
}