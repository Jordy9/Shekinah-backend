const {Router} = require('express')
const { obtenerTemas, CrearTemas, ActualizarTemas, EliminarTema } = require('../controllers/Tema')
const { validatJWT } = require('../middlewares/validar-jwt')
const router = Router()

// router.use(validatJWT)

router.get('/', obtenerTemas)

router.post('/', CrearTemas)

router.put('/:id', ActualizarTemas)

router.delete('/:id', EliminarTema)


module.exports = router