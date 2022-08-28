import ContainerDao from './ContainerDao.js';

export default class OrdersDao extends ContainerDao {

  constructor() {
    super('orders')
  }

  async getById(id) {
    return await super.getById({ id: id })
  }

  async getByEmail(email) {
    return await super.getByEmail({ idUser: email })
  }

  async getByName(email) {
    return await super.listByName({ idUser: email })
  }

}