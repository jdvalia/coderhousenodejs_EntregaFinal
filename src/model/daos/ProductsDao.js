import ContainerDao from './ContainerDao.js';
import CustomError from '../../errores/CustomError.js'
import logger from '../../logger.js';

export default class ProductsDao extends ContainerDao {

  constructor() {
    super('products')
  }

  async getById(id) {
    return await super.getById({ id: id })
  }

  async deleteById(id) {
    return await super.deleteById({ id: id })
  }

  async searchByName(name) {
    return await super.getById({ name: name })
  }

  async update({
    id,
    name,
    description,
    price,
    image
  }) {

    try {
      await this.collection.updateOne(
        {
          id: id
        },
        {
          '$set':
          {
            name: name,
            description: description,
            price: price,
            image: image
          }
        })

    } catch (err) {
      logger.error(err)
      throw new CustomError(500, 'Error al querer actualizar la BD con un documento a la coleccion por ID', err)
    }
  }


}