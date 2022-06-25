const {Router} = require('express')
const { obtenerRecords, CrearRecord, ActualizarRecord, EliminarRecord } = require('../controllers/record')
const { validatJWT } = require('../middlewares/validar-jwt')
const router = Router()


router.get('/', obtenerRecords)

router.use(validatJWT)

router.post('/new', CrearRecord)

router.put('/:id', ActualizarRecord)

router.delete('/:id', EliminarRecord)


module.exports = router