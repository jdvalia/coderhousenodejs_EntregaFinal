import express, { json, urlencoded } from 'express';
import passport from './controller/PassportController.js';
// rutas
import UsersRoutes from './routes/usuarios.js';
import ProductsRoutes from './routes/products.js';
import CartsRoutes from './routes/carts.js';
import OrdersRoutes from './routes/orders.js';
import webRoutes from './routes/web.js';
import ImagesRoutes from './routes/images.js';
import DefaultRoutes from "./routes/default.js";
import { engine as expressHbs } from "express-handlebars";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function crearServidor() {

    const app = express()
    app.use(express.static('public'))
    app.use(json()) //mdw para extraer el json que viene en las peticiones
    app.use(urlencoded({ extended: true }))  //mdw para poder extraer los datos que vienen en la url cuando se envia un formulario (el true para poder enviar objetos anidados)
    app.set('view engine', 'ejs') //Configuracion del motor de vistas 

    app.use(passport.initialize())

    // rutas apiRestFull
    app.use('/', webRoutes)
    app.use('/api/users', UsersRoutes) //usuarios que realizan la compra de los products
    app.use('/api/products', ProductsRoutes) //products que tiene el sitio
    app.use('/api/shoppingcartproducts', CartsRoutes) //carts de compras de los usuarios
    app.use('/api/orders', OrdersRoutes) // orders realizados por el usuario, cart pasa a estado Cerrado
    app.use('/api/images', ImagesRoutes) // Ruta para cargar imagenes 


    //Handlebars
    app.engine("hbs", expressHbs({
        extname: ".hbs",
        defaultLayout: "layout",
        layoutsDir: "views/handle/layouts/",
        partialsDir: "./handle/pages/",
    }));
    app.set("view engine", "hbs");

    //rutas no definidas
    app.use('/*', DefaultRoutes)

    return app
}