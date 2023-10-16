const {Router} = require('express')
const { obtenerUsuario, crearUsuario, loginUsuario, revalidarToken, actualizarUsuario, eliminarUsuario, googleLogin, facebookLogin, actualizarContrasena, obtenerUsuariosTop10 } = require('../controllers/auth')
const { validatJWT } = require('../middlewares/validar-jwt')
const router = Router()

router.get('/', obtenerUsuario)

router.get('/top10', obtenerUsuariosTop10)

router.post('/new', crearUsuario)

router.put('/:id', actualizarUsuario)

router.put('/updatePassword/:id', actualizarContrasena)

router.delete('/:id', eliminarUsuario)

router.post('/', loginUsuario)

router.post('/google', googleLogin)

router.post('/facebook', facebookLogin)

router.get('/renew', validatJWT, revalidarToken)

module.exports = router