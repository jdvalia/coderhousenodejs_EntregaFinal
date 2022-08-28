import UsuariosDao from '../model/daos/UsuariosDao.js';
import UsuarioDto from '../model/dtos/UsuarioDto.js';
import CustomError from '../errores/CustomError.js'
import logger from '../logger.js'
import { mdwValidateSchemaNewCart } from "../middleware/cartsMDW.js"
import * as cartsController from '../controller/CartsController.js'

export default class UsuariosApi {

    constructor() {
        this.usuariosDao = new UsuariosDao();
    }

    //obtiene los datos de un usuario segun email ingresado
    async getUsuario(email) {
        const usuariosObj = await this.usuariosDao.getByEmail(email);
        return usuariosObj;
    }

    //alta de usuario nuevo
    async crearUsuario(objetoUsuario) {

        try {
            const usuario = new UsuarioDto(objetoUsuario)
            usuario._id = await this.usuariosDao.add(usuario)
            logger.info(`Registro de Usuario Ok `);
            await mdwValidateSchemaNewCart(usuario.id)
            await cartsController.crearCart(usuario)
            throw new CustomError(200, `Usuario creado exitosamente en UsuariosAPI en crearUsuario`)
        }
        catch (err) {
            return new CustomError(401, `Error al crear el usuario`, err)
        }
    }


    //login de usuario
    async login(email, password) {
        try {
            const data = await this.usuariosDao.getByEmail(email)
            const usuario = new UsuarioDto(data)
            if (!usuario.isValidPassword(password))
                return false
            else
                return usuario.get();
        }
        catch (err) {
            throw new CustomError(401, `Error al loguearse`, err)
        }
    }

    async existeEmail(email) {
        try {
            await this.usuariosDao.getByEmail(email);
            return true;
        }
        catch (err) {
            throw email
        }
    }

    async obtenerUnUsuario() {
        let email = data.email;
        try {
            const usuariosList = await users.getUsuario(email)
            res.status(200).json(usuariosList)
        }
        catch (err) {
            logger.warn(err)
            res.status(err.estado).json(`Error al buscar todos los usuarios de USUARIOSAPI: ${err}`)
        }
    }

}