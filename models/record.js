const { Schema, Model, model } = require('mongoose')

const RecordSchema = Schema({
    jugadores: {
        type: Array,
        default: []
    },
    enPartida: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
})

module.exports = model('Record', RecordSchema)