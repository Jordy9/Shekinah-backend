const { Schema, model } = require('mongoose')

const TemasSchema = Schema({
    tema: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

module.exports = model('Temas', TemasSchema)