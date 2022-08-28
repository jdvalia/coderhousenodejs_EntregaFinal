import { MongoClient } from 'mongodb';
import logger from '../../logger.js'
import CustomError from '../../errores/CustomError.js'

const mongo_url = process.env.MONGO_URL
const base = process.env.MONGO_BASE

const client = new MongoClient(mongo_url, { serverSelectionTimeOutMS: 5000 });

await client.connect();

export default class ContainerDao {

    constructor(collection) {
        this.collectionName = collection
        this.collection = client.db(base).collection(collection)
    }

    async getAll() {
        try {
            const array = await this.collection.find().toArray()
            return array
        }
        catch (err) {
            logger.error(err)
            throw new CustomError(500, `Error al tratar de rescatar los datos de ${this.collectionName}`, err)
        }
    }

    async getById(query) {
        let respuesta

        try {
            respuesta = await this.collection.findOne(query);
        }
        catch (err) {
            logger.error(err)
            throw new CustomError(500, `Error cuando itentamos obtener por ID ${this.collectionName}`, err)
        }

        if (!respuesta) {
            throw new CustomError(404, `El Documento ${JSON.stringify(query)} no fue encontrado en la coleccion ${this.collectionName}`)
        }
        return respuesta
    }


    async getByEmail(email) {
        let respuesta

        try {
            respuesta = await this.collection.findOne(email);
        }
        catch (err) {
            logger.error("NO ENCONTRO EL EMAIL", err)
            throw new CustomError(500, `Error cuando itentamos obtener por ID ${this.collectionName}`, err)
        }

        if (!respuesta) {
            throw new CustomError(404, `El Documento ${JSON.stringify(email)} no fue encontrado en la coleccion ${this.collectionName}`)
        }
        return respuesta
    }


    async add(data) {
        try {
            const { insertedId } = await this.collection.insertOne(data)
            return insertedId;
        }
        catch (err) {
            logger.error(err)
            throw new CustomError(500, `Error al querer actualizar la BD ${this.collectionName}`, err)
        }
    }



    async deleteById(query) {

        let respuesta

        try {
            respuesta = await this.collection.deleteOne(query);
        }
        catch (err) {
            throw new CustomError(500, `Error cuando itentamos obtener por ID ${this.collectionName}`, err)
        }

        if (respuesta.deletedCount === 0) {
            throw new CustomError(404, `El Documento ${JSON.stringify(query)} no fue encontrado en la coleccion ${this.collectionName}`)
        } else {
            throw new CustomError(200, `Se ha borrado el Producto ${JSON.stringify(query)} de la BD`)
        }
    }

    async listByQuery(query) {
        try {
            const array = await this.collection.find(query).toArray()
            return array
        }
        catch (err) {
            throw new CustomError(500, `Error al querer rescatar info de la BD ${this.coleccionName}`, err)
        }

    }

    async listByName(name) {
        try {
            const array = await this.collection.find(name).toArray()
            return array
        }
        catch (err) {
            throw new CustomError(500, `Error al querer rescatar info de la BD ${this.coleccionName}`, err)
        }
    }
}
