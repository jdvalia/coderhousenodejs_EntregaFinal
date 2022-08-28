import CartsDao from '../model/daos/CartDao.js';
import CartDto from '../model/dtos/CartDto.js';

export default class CartsApi {

    constructor() {
        this.cartsDao = new CartsDao();
    }

    async getCart(idCart) {
        const cartsObj = await this.cartsDao.getById(idCart);
        return cartsObj;
    }


    async addCart(objeto) {
        const cart = new CartDto(objeto)
        await this.cartsDao.add(cart);
        return cart;
    }


    async findProductInCart(idCart, idProduct) {
        return await this.cartsDao.getById(idCart, idProduct);
    }

    async addProductAlCart(idCart, idProduct) {
        return await this.cartsDao.updateAgregarProductAlCart(idCart, idProduct);
    }

    async modProductAlCart(idCart, idProduct) {
        return await this.cartsDao.updateModificaProductAlCart(idCart, idProduct);
    }

    async deleteProductAlCart(idCart, idProduct) {
        return await this.cartsDao.updateEliminarProductAlCart(idCart, idProduct);
    }
}
