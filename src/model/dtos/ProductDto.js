import NUID from 'nuid'

export default class ProductDto {

    _id;
    id;
    name;
    description;
    price;
    image;

    constructor({ _id, id, name, description, price, image }) {
        if (_id === undefined) {
            this._id = undefined;
            this.id = NUID.next();
        }
        else {
            this._id = _id
            this.id = id;
        }

        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
    }

    get() {
        return this
    }

    getforCart() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            price: this.price,
            image: this.image,
        }
    }

}