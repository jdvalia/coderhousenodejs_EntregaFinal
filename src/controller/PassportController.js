import passport from 'passport';
import { Strategy } from 'passport-local';
import { Strategy as JWTstrategy } from 'passport-jwt';
import logger from '../logger.js'
import { jwtOpts } from '../../config/config.js'
import UsuariosApi from '../api/UsuariosApi.js'
import { validarToken } from '../controller/UsuariosController.js'
const users = new UsuariosApi();

//creacion de las estrategias de Passport

//estragegia de registro
passport.use('registro', new Strategy({ passReqToCallback: true }, async (req, username, password, done) => {
    logger.info(`PassportController.js - passport.use --> registro`)
    let usuario

    //valido si existe el usuario
    try {
        await users.obtenerUsuarioPorEmail(username) //si encuentra usuario quiere decir q ya esta registrado
        return done(null, false)
    } catch (error) {
        //todo OK, no encontro el usuario
    }

    //si no existe lo creo
    try {
        const datosUsuario = req.body
        usuario = await users.crearUsuario(datosUsuario)
    } catch (error) {
        return done(error)
    }
    done(null, usuario)
}))

//estrategia para login
passport.use('login', new Strategy(async (email, password, done) => {
    logger.info(`PassportController.js - passport.use --> login`)
    try {
        const user = await users.login(email, password)
        return done(null, user);
    } catch (error) {
        logger.error(error);
        return done(null, false);
    }
}))

passport.serializeUser((user, done) => {//recibe usuario que esta en la sesion y callback )
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use('jwt', new JWTstrategy(jwtOpts, validarToken));

export default passport;
