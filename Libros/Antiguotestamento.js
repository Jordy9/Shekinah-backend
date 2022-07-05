const genesis = require('../procesados/genesis')
const exodo = require('../procesados/exodo')
const levitico = require('../procesados/levitico')
const numeros = require('../procesados/numeros')
const deuteronomio = require('../procesados/deuteronomio')
const josue = require('../procesados/josue')
const jueces = require('../procesados/jueces')
const rut = require('../procesados/rut')
const samuel1 = require('../procesados/1_samuel')
const samuel2 = require('../procesados/2_samuel')
const reyes1 = require('../procesados/1_reyes')
const reyes2 = require('../procesados/2_reyes')
const cronicas1 = require('../procesados/1_cronicas')
const cronicas2 = require('../procesados/2_cronicas')
const esdras = require('../procesados/esdras')
const nehemias = require('../procesados/nehemias')
const ester = require('../procesados/ester')
const job = require('../procesados/job')
const salmos = require('../procesados/salmos')
const proverbios = require('../procesados/proverbios')
const eclesiastes = require('../procesados/eclesiastes')
const cantares = require('../procesados/cantares')
const isaias = require('../procesados/isaias')
const jeremias = require('../procesados/jeremias')
const lamentaciones = require('../procesados/lamentaciones')
const ezequiel = require('../procesados/ezequiel')
const daniel = require('../procesados/daniel')
const oseas = require('../procesados/oseas')
const joel = require('../procesados/joel')
const amos = require('../procesados/amos')
const abdias = require('../procesados/abdias')
const jonas = require('../procesados/jonas')
const miqueas = require('../procesados/miqueas')
const nahum = require('../procesados/nahum')
const habacuc = require('../procesados/habacuc')
const sofonias = require('../procesados/sofonias')
const hageo = require('../procesados/hageo')
const zacarias = require('../procesados/zacarias')
const malaquias = require('../procesados/malaquias')

const Antiguotestamento = () => {
    const Antiguotestamento = []

    Antiguotestamento.push(genesis, exodo, levitico, numeros, deuteronomio, josue, jueces, rut, samuel1, samuel2, reyes1, reyes2, cronicas1, cronicas2, esdras, nehemias,
        ester, job, salmos, proverbios, eclesiastes, cantares, isaias, jeremias, lamentaciones, ezequiel, daniel, oseas, joel, amos, abdias,
        jonas, miqueas, nahum, habacuc, sofonias, hageo, zacarias, malaquias)
        
    return Antiguotestamento
}


module.exports = Antiguotestamento
