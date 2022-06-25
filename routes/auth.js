const {Router} = require('express')
const { obtenerUsuario, crearUsuario, loginUsuario, revalidarToken, actualizarUsuario, eliminarUsuario } = require('../controllers/auth')
const { validatJWT } = require('../middlewares/validar-jwt')
const router = Router()


router.get('/', obtenerUsuario)

router.post('/new', crearUsuario)

router.put('/:id', actualizarUsuario)

router.delete('/:id', eliminarUsuario)

router.post('/', loginUsuario)

router.get('/renew', validatJWT, revalidarToken)


module.exports = router