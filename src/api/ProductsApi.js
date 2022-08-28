import ProductsDao from '../model/daos/ProductsDao.js';
import ProductDto from '../model/dtos/ProductDto.js';

export default class ProductsApi {

    constructor() {
        this.productsDao = new ProductsDao();
    }

    async getProducts() {
        const productsObj = await this.productsDao.getAll();
        return productsObj;
    }

    async getProduct(id) {
        const productsObj = await this.productsDao.getById(id);
        return new ProductDto(productsObj);
    }

    async addProduct(objeto) {
        const product = new ProductDto(objeto)
        await this.productsDao.add(product);
        return product;
    }

    async putProduct(objeto) {
        await this.productsDao.update(objeto);
        const productsObj = await this.productsDao.getById(objeto.id)
        return new ProductDto(productsObj);
    }

    async deleteProduct(id) {
        await this.productsDao.deleteById(id);
    }


    async existeName(name) {
        try {
            await this.productsDao.searchByName(name);
            return true;
        }
        catch (err) {
            throw name
        }
    }
}
