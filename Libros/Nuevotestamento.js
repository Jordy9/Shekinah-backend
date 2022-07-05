const mateo = require('../procesados/mateo')
const marcos = require('../procesados/marcos')
const lucas = require('../procesados/lucas')
const juan = require('../procesados/juan')
const hechos = require('../procesados/hechos')
const romanos = require('../procesados/romanos')
const corintios1 = require('../procesados/1_corintios')
const corintios2 = require('../procesados/2_corintios')
const galatas = require('../procesados/galatas')
const efesios = require('../procesados/efesios')
const filipenses = require('../procesados/filipenses')
const colosenses = require('../procesados/colosenses')
const tesalonisenses1 = require('../procesados/1_tesalonicenses')
const tesalonisenses2 = require('../procesados/2_tesalonicenses')
const timoteo1 = require('../procesados/1_timoteo')
const timoteo2 = require('../procesados/2_timoteo')
const tito = require('../procesados/tito')
const filemon = require('../procesados/filemon')
const hebreos = require('../procesados/hebreos')
const santiago = require('../procesados/santiago')
const pedro1 = require('../procesados/1_pedro')
const pedro2 = require('../procesados/2_pedro')
const juan1 = require('../procesados/1_juan')
const juan2 = require('../procesados/2_juan')
const juan3 = require('../procesados/3_juan')
const judas = require('../procesados/judas')
const apocalipsis = require('../procesados/apocalipsis')

const Nuevotestamento = () => {

    const Nuevotestamento = []
    
    Nuevotestamento.push(mateo, marcos, lucas, juan, hechos, romanos, corintios1, corintios2, galatas, efesios, filipenses, colosenses, tesalonisenses1, tesalonisenses2,
        timoteo1, timoteo2, tito, filemon, hebreos, santiago, pedro1, pedro2, juan1, juan2, juan3, judas, apocalipsis)
    return Nuevotestamento
}

module.exports = Nuevotestamento
