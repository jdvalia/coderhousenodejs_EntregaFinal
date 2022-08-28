import OrdersApi from '../api/OrdersApi.js'
import logger from '../logger.js'
import CartsApi from '../api/CartsApi.js'

const orders = new OrdersApi();
const carts = new CartsApi();

//devuelve todos los orders de todos los usuarios 
export async function obtenerOrders(req, res) {
    try {
        const ordersList = await orders.getOrders()
        res.status(200).json(ordersList)
    }
    catch (err) {
        logger.error(err);
        res.status(err.estado).json(err)
    }
}

//devuelve un order en particular enviado por parametro
export async function obtenerOrder(req, res) {
    let idOrder = req.params.idOrder;
    try {
        const ordersList = await orders.getOrder(idOrder)
        res.status(200).json(ordersList)
    }
    catch (err) {
        logger.error(err);
        res.status(err.estado).json(err)
    }
}

//devuelve los orders del email pasado como parametro
export async function obtenerOrdersPorEmail(req, res) {
    try {
        let email = req.user.id;
        const ordersList = await orders.getOrders(email)
        res.status(200).json(ordersList)
    }
    catch (err) {
        logger.error(err);
        res.status(err.estado).json(err)
    }
}

//agrega un nuevo order
export async function agregarOrder(req, res) {
    try {
        let objeto = req.user.id;
        const cartsList = await carts.getCart(objeto)
        if (cartsList.products == "") {
            res.status(200).json(`No se genera una nueva Orden porque su Carrito esta vacio`)
        } else {
            const order = await orders.addOrder(cartsList)
            res.status(200).json(order)
        }

        let borraProdCart = ({});
        const cart = await carts.deleteProductAlCart(objeto, borraProdCart)//deleteAllProductsCart

    }
    catch (err) {
        logger.error(err);
        res.status(err.estado).json(err)
    }
}
