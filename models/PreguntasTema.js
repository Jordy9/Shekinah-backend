const { Schema, model } = require('mongoose')

const PreguntasTemaSchema = Schema({
    pregunta: {
        type: String,
        required: true
    },
    respuesta: {
        type: Object,
        required: true
    },
    tema: {
        type: String
    },
    nota: {
        type: String
    },
    tipo: {
        type: String,
        default: 'Tema'
    }
}, {
    timestamps: true
})

module.exports = model('PreguntasTema', PreguntasTemaSchema)