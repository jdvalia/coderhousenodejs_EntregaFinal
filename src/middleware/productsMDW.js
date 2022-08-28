import schemaNewProduct from '../schemas/productsSchemas.js'
import ProductsApi from '../api/ProductsApi.js'
import logger from '../logger.js'

const products = new ProductsApi();

export async function mdwValidateSchemaNewProduct(req, res, next) {
    let data
    try {
        data = await schemaNewProduct.validateAsync(req.body)
    }
    catch (err) {
        logger.warn(`Error al validar el esquema de products - Error: ${err}`)
        return res.status(400).json({ descripcion: `Error al validar el esquema de products - Error: ${err}` })
    }

    try {
        if (await products.existeName(data.name)) {
            return res.status(400).json({ descripcion: 'Este producto ya existe' })
        }
    }
    catch (err) {
    }

    next();

}