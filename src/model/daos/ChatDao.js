import ContainerDao from './ContainerDao.js';
//import logger from '../../logger.js'


export default class ChatDao extends ContainerDao {

  constructor() {
    super('chat')
  }

  async getByEmail(email) {
    return await super.listByQuery({ email: email })
  }

}
