import { Router } from 'express'
import * as ordersController from '../controller/OrdersController.js'
import passport from '../controller/PassportController.js'

const OrdersRoutes = new Router();

//POST '/orders' -> agrega un nuevo order --> esto se da cuando el usuario clickea en "comprar" el cart. Debemos enviar el usuario (campo "email") y los products como array
OrdersRoutes.post('/',
    passport.authenticate('jwt', { session: false }),
    ordersController.agregarOrder)

//GET '/orders/usuario/email' -> devuelve los orders dado un email
OrdersRoutes.get('/',
    passport.authenticate('jwt', { session: false }),
    ordersController.obtenerOrdersPorEmail)

export default OrdersRoutes 