const { Schema, model } = require('mongoose')

const PreguntasSchema = Schema({
    pregunta: {
        type: String,
        required: true
    },
    idPregunta: {
        type: String,
        required: true,
        unique: true
    },
    respuesta: {
        type: Object,
        required: true
    },
    dificultad: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    testamento: {
        type: String,
        required: true
    },
    libro: {
        type: String,
        required: true
    },
    capitulo: {
        type: String,
        required: true
    },
    desdeVersiculo: {
        type: String,
        required: true
    },
    hastaVersiculo: {
        type: String,
        required: true
    },
    tema: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = model('Preguntas', PreguntasSchema)