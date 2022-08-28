import logger from '../logger.js'
import UsuariosApi from '../api/UsuariosApi.js'
import ChatApi from '../api/ChatApi.js'
import jwt from 'jsonwebtoken'
import { jwtOpts } from '../../config/config.js'

import os from 'os'
const cantidadDeCPUs = os.cpus().length

const usuarios = new UsuariosApi();
const chat = new ChatApi();
let rolUsuario = undefined
let nombreUsuario = ""
let emailUsuario = ""

//getInicio
export async function getInicio(req, res) {
  const title = 'ecomerce'

  try {
    res.render('pages/index', { titulo: title, rol: rolUsuario, nombre: nombreUsuario })
  }
  catch (err) {
    logger.error(err);
    res.status(err.estado).json(err)
  }
}


//getlogin
export async function getLogin(req, res) {
  const title = 'Login'
  res.render('pages/login', { titulo: title, rol: rolUsuario, nombre: nombreUsuario })
}

//postlogin
export async function postLogin(req, res) {
  emailUsuario = req.body.username;
  const usuario = await usuarios.getUsuario(emailUsuario)
  nombreUsuario = usuario.nombre
  const title = 'ecomerce'
  const token = jwt.sign({ user: emailUsuario }, jwtOpts.secretOrKey, { expiresIn: jwtOpts.expireIn });
  res.render('pages/index', { titulo: title, rol: rolUsuario, nombre: nombreUsuario })
}

//getfailLogin
export async function getfailLogin(req, res) {
  const title = 'El usuario y/o contraseña ingresada son incorrectas'
  res.render('pages/error', { titulo: title, detalle: undefined, rol: rolUsuario, nombre: nombreUsuario })
}


//infoServer
export async function infoServer(req, res) {
  const title = 'ecomerce'
  const info = {
    'port': process.env.PORT,
    'plataforma': process.platform,
    'version_node': process.version,
    'memoria_total_reservada': process.memoryUsage().rss,
    'path_ejecucion': process.execPath,
    'process_id': process.pid,
    'carpeta_proyecto': process.cwd(),
    'cantidad_cpus': cantidadDeCPUs
  }

  try {
    res.render('pages/infoServer', { titulo: title, rol: rolUsuario, nombre: nombreUsuario, info })
  }
  catch (err) {
    logger.error(err);
    res.status(err.estado).json(err)
  }
}

//mensajesChat
export async function mensajesChat(req, res) {
  try {
    const title = 'Mensajes del Chat'
    const mensajesChatList = await chat.getMensajesChat()
    res.render('pages/chat.ejs', { email: emailUsuario, mensajesChatList })
  }
  catch (err) {
    logger.error(err);
    res.status(err.estado).json(err)
  }
}
