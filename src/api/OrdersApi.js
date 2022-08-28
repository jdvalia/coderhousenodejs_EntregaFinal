import OrdersDao from '../model/daos/OrdersDao.js';
import UsuariosDao from '../model/daos/UsuariosDao.js';
import OrdersDto from '../model/dtos/OrdersDto.js';
import CustomError from '../errores/CustomError.js'
import logger from '../logger.js'
import { enviarEmail } from './notificaciones/email.js'


export default class OrdersApi {

    constructor() {
        this.ordersDao = new OrdersDao();
        this.usuariosDao = new UsuariosDao();
    }

    async getOrders(IdUser) {
        try {
            return await this.ordersDao.getByName(IdUser);
        }
        catch (err) {
            logger.error(`Error al solicitar todos los orders: ${err}`);
            throw new CustomError(401, `Error al solicitar todos los orders`, err)
        }
    }

    async getOrder(idOrder) {
        try {
            return await this.ordersDao.getById(idOrder);
        }
        catch (err) {
            logger.error(`Error al solicitar el order ${idOrder}: ${err}`);
            throw new CustomError(401, `Error al solicitar el order ${idOrder}`, err)
        }
    }

    async getOrdersPorEmail(idOrder) {
        try {
            return await this.ordersDao.getByEmail(idOrder);
        }
        catch (err) {
            logger.error(`Error solicitar los orders de un usuario: ${err}`);
            throw new CustomError(401, `Error solicitar los orders de un usuario`, err)
        }
    }

    async addOrder(objeto) {

        try {
            //cargo el order
            const order = new OrdersDto(objeto)
            await this.ordersDao.add(order);
            //obtengo los datos del usuario
            const usuario = await this.usuariosDao.getByUserId(order.idUser)
            //envio de notificaciones al admin y usuario
            await this.enviarEmailNuevoOrder(order, usuario.name, usuario.lastname, usuario.email)
            await this.enviarEmailalUser(order, usuario.name, usuario.lastname, usuario.email)
            return order.get();
        }
        catch (err) {
            logger.error(`Error al agregar un order: ${err}`);
            throw new CustomError(401, `Error al agregar un order`, err)
        }
    }

    //envia mail al ADMIN por nueva compra
    async enviarEmailNuevoOrder(order, nombre, apellido, email) {
        try {
            //convierto objeto a array 
            const objetoOrders = order.products
            var arrayOrder = objetoOrders.map(function (o) {
                return Object.keys(o).reduce(function (array, key) {
                    return array.concat([key, o[key]]);
                }, []);
            })
            //armo listado de products para enviar por email 
            let listadoProductsHTML = ""
            for (let i = 0; i < arrayOrder.length; i++) {
                listadoProductsHTML = listadoProductsHTML + "<tr><td>" + arrayOrder[i][1] + "</td><td>" + arrayOrder[i][3] + "</td></tr>"
            }

            //armo los datos que voy a enviar por email
            let correoDestino = 'admin@admin.com'
            let asunto = `Nueva compra del Usuario ${nombre} ${apellido} - ${email}`
            let cuerpo = `<h1> Nuevo Order de ${nombre} ${apellido} - ${email}</h1>
            <p><strong>Email del usuario: </strong>${email}</p>
            <p><strong>Fecha de la compra por el usuario: </strong>${order.fecha}</p>
            <p><strong>Productos comprados: </strong></p>
            <p>
            <table border=1>
                <tr>
                    <th>Id Product</th>
                    <th>cantidad</th>
                </tr>
                ${listadoProductsHTML}
            </table></p>`
            await enviarEmail(correoDestino, asunto, cuerpo)
        } catch (err) {
            logger.error(`Falló el envio de mail del nuevo order - error:${err}`)
        }
    }


    //envia mail al USUARIO por nueva compra
    async enviarEmailalUser(order, nombre, apellido, email) {
        try {
            //convierto objeto a array 
            const objetoOrders = order.products
            var arrayOrder = objetoOrders.map(function (o) {
                return Object.keys(o).reduce(function (array, key) {
                    return array.concat([key, o[key]]);
                }, []);
            })
            //armo listado de products para enviar por email 
            let listadoProductsHTML = ""
            for (let i = 0; i < arrayOrder.length; i++) {
                listadoProductsHTML = listadoProductsHTML + "<tr><td>" + arrayOrder[i][1] + "</td><td>" + arrayOrder[i][3] + "</td></tr>"
            }

            //armo los datos que voy a enviar por email
            let correoDestino = email
            let asunto = `Hola ${nombre} ${apellido} !!. Usted ha realizado una nueva compra con el siguiente codigo de seguimiento ${order.id}`
            let cuerpo = `<h1> Felicitaciones ${nombre} ${apellido} !</h1>
            <p><strong>Codigo de Seguimiento de la nueva Compra Realizada: </strong>${order.id}</p>
            <p><strong>Fecha de compra:  </strong>${order.fecha}</p>
            <p><strong>Productos comprados: </strong></p>
            <p>
            <table border=1>
                <tr>
                    <th>Id Product</th>
                    <th>cantidad</th>
                </tr>
                ${listadoProductsHTML}
            </table></p>`
            await enviarEmail(correoDestino, asunto, cuerpo)
        } catch (err) {
            logger.error(`Falló el envio de mail del nuevo order - error:${err}`)
        }
    }

}
