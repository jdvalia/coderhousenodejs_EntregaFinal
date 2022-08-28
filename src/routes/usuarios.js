import { Router } from 'express'
import passport from '../controller/PassportController.js'
import * as userController from '../controller/UsuariosController.js'
import { mdwValidateSchemaNewUsuario } from "../middleware/usuariosMDW.js"

const UsersRoutes = new Router();

//POST /registro --> para dar de alta un nuevo usuario
UsersRoutes.post('/',
    mdwValidateSchemaNewUsuario,
    passport.authenticate('registro', {
        failureRedirect: '/api/users/failRegister'
    }),
    userController.successRegister
);
UsersRoutes.post('/failRegister', userController.failRegister);
UsersRoutes.post('/successRegister', userController.successRegister);

//POST '/login' --> recibe email y password del usuario
UsersRoutes.post('/login',
    passport.authenticate('login', { failureRedirect: '/api/users/failLogin' }),
    userController.successLogin
);
UsersRoutes.post('/failLogin', userController.failLogin);
UsersRoutes.post('/successLogin', userController.successLogin);

export default UsersRoutes 