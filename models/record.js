const { Schema, Model, model } = require('mongoose')

const RecordSchema = Schema({
    idJugador: {
        type: String,
        required: true
    },
    puntos: {
        type: Number,
        required: true,
        default: 0
    },
    aciertos: {
        type: Number,
        default: 0
    },
    errores: {
        type: Number,
        default: 0
    },
    reforzar: {
        type: Array,
        default: []
    },
    racha: {
        type: Number,
        default: 1
    },
    preguntas: {
        type: Array,
        required: true,
    },
    preguntaNo: {
        type: Number,
        required: true,
        default: 0
    },
    seleccionadas: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
})

module.exports = model('Record', RecordSchema)