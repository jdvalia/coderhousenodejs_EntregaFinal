import NUID from 'nuid'
import moment from 'moment'

export default class OrdersDto {
    _id;
    id;
    idUser;
    fecha;
    products;

    constructor({ _id, id, idUser, products, fecha }) {

        this._id = undefined;
        this.id = NUID.next();
        this.fecha = moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
        this.idUser = id;
        this.products = products;
    }

    get() {
        return this
    }
}