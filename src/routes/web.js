import { Router } from 'express'
import * as webController from '../controller/webController.js'
import passport from '../controller/PassportController.js'

const webRoutes = new Router();

// Pantalla de inicio
webRoutes.get('/', webController.getInicio);

//LOGUEARSE
webRoutes.get('/login', webController.getLogin);
//POST '/login' --> recibe email y password del usuario
webRoutes.post('/login', passport.authenticate('login', {
  failureRedirect: '/failLogin'
}),
  webController.postLogin
);

//CHAT
webRoutes.get('/chat', webController.mensajesChat);

//INFO SERVER
webRoutes.get('/infoServer', webController.infoServer);

//ERRORES
webRoutes.get('/failLogin', webController.getfailLogin)

export default webRoutes