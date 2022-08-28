//import logger from '../../logger.js';
import ContainerDao from './ContainerDao.js';

export default class UsuariosDao extends ContainerDao {

  constructor() {
    super('users')
  }


  async getByEmail(email) {
    return super.getByEmail({ "email": email })
  }

  async getByUserId(idUser) {
    return super.getById({ "id": idUser })
  }

}