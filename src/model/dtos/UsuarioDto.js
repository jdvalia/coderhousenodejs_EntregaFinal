import bCrypt from 'bcrypt';
import NUID from 'nuid';

export default class UsuarioDto {

    _id;
    id;
    name;
    lastname;
    email;
    password;
    phone;
    image;

    constructor({ _id, id, name, lastname, email, password, phone, image }) {
        if (_id === undefined) {
            this._id = undefined;
            this.id = NUID.next();
            this.password = createHash(password)
        }
        else {
            this._id = _id;
            this.id = id;
            this.password = password;
        }

        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.phone = phone;
        this.image = image;

    }

    get() {
        return this
    }

    isValidPassword(password) {
        return bCrypt.compareSync(password, this.password);
    }

}

function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
