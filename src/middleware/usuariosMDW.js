import schemaNewUser from '../schemas/usuariosSchemas.js'
import UsuariosApi from '../api/UsuariosApi.js'
import logger from '../logger.js'


const usuarios = new UsuariosApi();

export async function mdwValidateSchemaNewUsuario(req, res, next) {
    let data
    try {
        data = await schemaNewUser.validateAsync(req.body)
    }
    catch (err) {
        logger.warn(`Error al validar el esquema de usuarios - Error: ${err}`)
        return res.status(400).json({ descripcion: `Error al validar el esquema de usuarios - Error: ${err}` })
    }

    try {
        if (await usuarios.existeEmail(data.email)) {
            return res.status(400).json({ descripcion: `El email ${data.email} ya se encuentra registrado` })
        }
    }
    catch (err) {
        const datosUsuario = req.body
        let usuario = ""
        usuario = await usuarios.crearUsuario(datosUsuario) //crear usuario
        return res.status(200).json({ descripcion: `Ha sido dado de alta el usuario con el siguiente mail: ${err}` })
    }

    next(data.email);
}