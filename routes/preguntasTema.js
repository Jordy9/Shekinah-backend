const {Router} = require('express')
const { obtenerPreguntasTemas, CrearPreguntaTema, ActualizarPreguntaTema, EliminarPreguntaTema } = require('../controllers/preguntasTema')
const { validatJWT } = require('../middlewares/validar-jwt')
const router = Router()

router.get('/', obtenerPreguntasTemas)

// router.use(validatJWT)

router.post('/', CrearPreguntaTema)

router.put('/:id', ActualizarPreguntaTema)

router.delete('/:id', EliminarPreguntaTema)


module.exports = router