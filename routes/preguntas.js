const {Router} = require('express')
const { obtenerPreguntas, CrearPregunta, ActualizarPregunta, EliminarPregunta, obtenerPreguntasPaginadas, obtenerPreguntasPaginadasJuego, obtenerPreguntasPaginadasJuegoPersonalizadas } = require('../controllers/preguntas')
const { validatJWT } = require('../middlewares/validar-jwt')
const router = Router()


router.get('/', obtenerPreguntas)

router.get('/pag', obtenerPreguntasPaginadas)

router.get('/juego', obtenerPreguntasPaginadasJuego)

router.get('/juegoP', obtenerPreguntasPaginadasJuegoPersonalizadas)

// router.use(validatJWT)

router.post('/new', CrearPregunta)

router.put('/:id', ActualizarPregunta)

router.delete('/:id', EliminarPregunta)


module.exports = router