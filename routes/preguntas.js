const {Router} = require('express')
const { obtenerPreguntas, CrearPregunta, ActualizarPregunta, EliminarPregunta, obtenerPreguntasPaginadas, obtenerPreguntasPaginadasJuego, obtenerPreguntasPaginadasJuegoPersonalizadas, obtenerPreguntasPorId, obtenerPreguntasPorTema, JugarPreguntasPorTema, JugarPreguntasAnalisis } = require('../controllers/preguntas')
const { validatJWT } = require('../middlewares/validar-jwt')
const router = Router()


router.get('/', obtenerPreguntas)

router.get('/pag', obtenerPreguntasPaginadas)

router.get('/tema', obtenerPreguntasPorTema)

router.get('/preguntasTOGame', JugarPreguntasPorTema)

router.get('/juego', obtenerPreguntasPaginadasJuego)

router.post('/juegoP', obtenerPreguntasPaginadasJuegoPersonalizadas)

router.post('/juegoId', obtenerPreguntasPorId)

router.get('/analisis', JugarPreguntasAnalisis)

// router.use(validatJWT)

router.post('/new', CrearPregunta)

router.put('/:id', ActualizarPregunta)

router.delete('/:id', EliminarPregunta)


module.exports = router