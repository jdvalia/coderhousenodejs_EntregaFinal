import { Router } from 'express'
import * as cartsController from '../controller/CartsController.js'
import passport from '../controller/PassportController.js'

const CartsRoutes = new Router();


//GET '/shoppingcartproducts' -> devuelve el contenido del cart del usuario logueado 
CartsRoutes.get('/',
        passport.authenticate('jwt', { session: false }),
        cartsController.obtenerCart)

//POST '/carts/:id/products' -> agrega un product al cart indicado x el body
CartsRoutes.post('/',
        passport.authenticate('jwt', { session: false }),
        cartsController.agregarProductAlCart)

//DELETE '/carts/:id/product/:id' -> elimina un product al cart indicado. El ID del producto a borrar es el TEXTO
CartsRoutes.delete('/:productId',
        passport.authenticate('jwt', { session: false }),
        cartsController.borrarProductAlCart)

export default CartsRoutes 