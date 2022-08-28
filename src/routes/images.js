import { Router } from 'express'
import multer from 'multer'

const ImagesRoutes = new Router();

/* ------------------------------------------------------ */
/* Multer config */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({ storage: storage })
/* ------------------------------------------------------ */

ImagesRoutes.post('/', upload.single('attachment'), (req, res, next) => {

  if (!req.file) {
    let sinimagen = 'Debe ingresar una imagen';
    res.status(400).send(sinimagen);
  }
  else {

    let fileName = ("Se ha cargado el siguiente archivo:   " + req.file.destination + "/" + req.file.filename)
    res.status(200).send(fileName);
  }

});

export default ImagesRoutes