import CartsApi from '../api/CartsApi.js'
import logger from '../logger.js'
import ProductsApi from '../api/ProductsApi.js'

const carts = new CartsApi();
const products = new ProductsApi();

//devuelve el cart del usuario logueado
export async function obtenerCart(req, res) {
    try {
        const cartsList = await carts.getCart(req.user.id)
        res.status(200).json(cartsList)
    }
    catch (err) {
        logger.error(err);
        res.status(err.estado).json(err)
    }
}

//crea un cart exclusivo para un Usuario con el mismo UserId
export async function crearCart(req, res) {
    try {
        const cart = await carts.addCart(req)
    }
    catch (err) {
        logger.error(err);
    }
}

// recibe y agrega un product al cart indicado x el body. Si ya está dentro del Carrito, le suma una cantidad
export async function agregarProductAlCart(req, res) {

    let idCart = req.user.id;
    let productId = req.body.productId;
    let armaProdCart1;
    let armaProdCart2;
    let cant = 1
    let paso = 0
    let respuesta
    let respuestacart


    try {
        respuesta = await products.getProduct(productId) //verifica si el Producto Solicitado existe
        if (respuesta.id == productId) { //Si realmente existe, entra acá
            respuestacart = await carts.findProductInCart(idCart, productId) //Busca si el Producto Solicitado ya está dentro del Carrito
            if (respuestacart.products == "") { // Si el Carrito está vacío.....
                armaProdCart2 = ({ Productid: productId, cant: cant }); // ..... Agrega el Producto al Carrito
            } else {
                //convierto objeto a array .... El CArrito existente
                const objetoOrders = respuestacart.products
                var arrayOrder = objetoOrders.map(function (o) {
                    return Object.keys(o).reduce(function (array, key) {
                        return array.concat([key, o[key]]);
                    }, []);
                })
                //Verifico Todos los Productos dentro del Carrito (sus IDs y sus cantidades)
                let listadoProducts = ""
                for (let i = 0; i < arrayOrder.length; i++) {
                    listadoProducts = listadoProducts + arrayOrder[i][1] + " " + arrayOrder[i][2] + " " + arrayOrder[i][3]

                    if (arrayOrder[i][1] === productId) { //Si el PRoducto Solicitado ya está cargado en el Carrito, le sumo una Cantidad
                        cant = arrayOrder[i][3]
                        cant++
                        if (cant > 1) { //Si la Cantidad es más que 1.....
                            armaProdCart2 = ({ Productid: productId, cant: cant });
                            armaProdCart1 = respuestacart.products;
                            armaProdCart1[i] = armaProdCart2
                            i = 1000 //Fuerzo el valor de i a un valor ato tal que salga del FOR que verifica los Productos Cargados en el Carrito, ya que lo encontró y no vale la pena seguir buscando
                            paso = 999 //Fuerzo el valor de esta variable a un numero alto para que sepamos que ya está hecha la suma de cantidad de este Producto a este Carrito y que luego actúe en consecuencia mas adelante
                        } else {
                        }
                    } else {

                        if (paso < i) {
                            paso++
                        } else {
                            armaProdCart2 = ({ Productid: productId, cant: cant });
                            paso = 100
                        }
                    }
                }
            }

            try {
                if (paso == 999) { //Si el Valor de la variable paso es 999, quiere decir que el Producto ya estaba en el carrito y que debe sumar en 1 su cantidad
                    const cart = await carts.modProductAlCart(idCart, armaProdCart1)
                    res.status(200).json(cart)
                } else { //Si el valor de paso es distinto a 999, quiere decir que recorrió todo el carrito y no encontró la presencia del Producto Solicitado.... Entonces lo agrega.
                    const cart = await carts.addProductAlCart(idCart, armaProdCart2)
                    res.status(200).json(cart)
                }
            }
            catch (err) {
                res.status(200).json(err)
            }

        }
        else {
            return res.status(400).json({ descripcion: 'El producto seleccionado NO EXISTE' })
        }
    }
    catch (err) {
        res.status(err.estado).json(err)
    }
}

// recibe y elimina un producto al cart indicado 
export async function borrarProductAlCart(req, res) {
    let idCart = req.user.id;
    let productId = req.params.productId;
    let respuesta
    let respuestacart
    let armaProdCart1;
    let armaProdCart2;
    let cant = 1
    let paso = 0

    try {
        respuesta = await products.getProduct(productId)   //Verifica si el Producto que pidió sacar del Carrito existe como Producto dentro de la BD
        if (respuesta.id == productId) { // Si existe......
            respuestacart = await carts.findProductInCart(idCart, productId) //.... verifica si el Producto solicitado está dentro del Carrito
            if (respuestacart.products == "") {  //Si el Carrito está vacío, pongo la variable paso en 9999 para que luego actúe en consecuencia
                paso = 9999
            } else {
                //convierto objeto a array ... Es el carrito existente
                const objetoOrders = respuestacart.products
                var arrayOrder = objetoOrders.map(function (o) {
                    return Object.keys(o).reduce(function (array, key) {
                        return array.concat([key, o[key]]);
                    }, []);
                })
                //Verifico Todos los Productos dentro del Carrito (sus IDs y sus cantidades)
                let listadoProducts = ""
                for (let i = 0; i < arrayOrder.length; i++) {
                    listadoProducts = listadoProducts + arrayOrder[i][1] + " " + arrayOrder[i][2] + " " + arrayOrder[i][3]
                    if (arrayOrder[i][1] === productId) {  //Si el Producto solicitado está dentro del carrito, entonces le resto en 1 su cantidad
                        cant = arrayOrder[i][3]
                        cant--
                        if (cant > 0) {  //si aún queda al menos 1 cantidad de este Producto, entonces armo el Objeto con el Producto y su nuevo valor de cantidades
                            armaProdCart2 = ({ Productid: productId, cant: cant });
                            armaProdCart1 = respuestacart.products;
                            armaProdCart1[i] = armaProdCart2
                            i = 1000 //Fuerzo el valor de i a un valor ato tal que salga del FOR que verifica los Productos Cargados en el Carrito, ya que lo encontró y no vale la pena seguir buscando
                            paso = 999 //Fuerzo el valor de esta variable a un numero alto para que sepamos que ya está hecha la suma de cantidad de este Producto a este Carrito y que luego actúe en consecuencia mas adelante
                        } else {
                            armaProdCart2 = ({ Productid: productId, cant: 1 }); // Si pasa por acá es porque el Valor de Cantidad para este Producto (Dentro del Carrito) era 1.... Lo vuelvo a poner en 1 para que luego actúa en consecuencia
                        }
                    } else {
                    }
                }
            }

        } else {
            return res.status(400).json({ descripcion: 'El producto seleccionado NO EXISTE' })
        }

        try {
            if (paso == 999) { //si el valor de la variable paso es 999, el Producto estaba dentro del Carrito y debemos actualizar sus cantidades
                const cart = await carts.modProductAlCart(idCart, armaProdCart1)
                res.status(200).json(cart)
            } else {
                if (paso == 9999) {  //si el valor de la variable paso es 9999, el Producto NO estaba dentro del carrito
                    const cart = `El Producto ${productId} no se encuentra dentro del Carrito`
                    res.status(200).json(cart)
                } else { //si el valor de la variable paso es distinto, entonces debemos borrar el Producto dentro del carrito, ya que originalmente estaba dentro del mismo con la Cantidad en 1
                    const cart = await carts.deleteProductAlCart(idCart, armaProdCart2)
                    res.status(200).json(cart)
                }
            }
        }
        catch (err) {
            res.status(200).json(err)
        }
    }

    catch (err) {
        logger.error(err);
        res.status(err.estado).json(err)
    }
}
