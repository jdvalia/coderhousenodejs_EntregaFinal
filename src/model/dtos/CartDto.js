export default class CartDto {

    constructor({ _id, id }) {

        if (_id === undefined) {

            this._id = undefined;
            this.id = id;
            this.products = [];
        }
        else {
            this._id = _id;
            this.id = id;
            this.products = [];
        }
    }

    get() {
        return this
    }
}