import UsersApi from '../api/UsuariosApi.js'
import logger from '../logger.js'
import jwt from 'jsonwebtoken'
import { jwtOpts } from '../../config/config.js'

const users = new UsersApi();

//successRegister
export async function successRegister(req, res) {
    logger.info(`UsuariosController.js: successRegister`)
    res.status(200).json({ msg: `El registro se realizó correctamente` })
}

//failRegister
export async function failRegister(req, res) {
    logger.info(`UsuariosController.js: failRegister`)
    res.status(400).json({ err: 'Error al registrarse un nuevo usuario' })
}

//successLogin
export function successLogin(req, res) {
    logger.info(`UsuariosController.js: successLogin`)
    const token = jwt.sign({ user: req.user }, jwtOpts.secretOrKey, { expiresIn: jwtOpts.expireIn });
    res.status(200).json({ msg: `Para poder acceder a las api privadas debe ingresar el token:       ${token}` })
}

//failLogin
export function failLogin(req, res) {
    logger.info(`UsuariosController.js: failLogin`)
    res.status(400).json({ err: 'Error al loguearse' })
}

export function validarToken(token, cb) {
    if (token.exp < Math.floor(Date.now() / 1000)) {
        logger.warn('El token ha caducado, debe volver a loguearse para generar un nuevo token')
        return cb(null, false)
    }
    else {
        return cb(null, token.user);
    }
}


export function esAdministrador(req, res, next) {
    logger.info(`UsuariosController.js: esAdministrador`)
    let rolUsuario = req.user.name
    let administrador = false

    if (rolUsuario === "admin") {
        administrador = true
    }

    if (administrador)
        next()
    else {
        logger.warn(`El usuario ${req.user.email} no tiene permisos de administrador y quizo acceder a una ruta no autorizada.`);
        res.status(403).json({ error: `Ruta no autorizada. El usuario ${req.user.email} no tiene permisos de administrador.` })
    }

}