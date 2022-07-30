const { Schema, model } = require('mongoose')

const UsuarioSchema = Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    Juego: {
        type: Object
    },
    role: {
        type: String,
        default: 'usuario',
        required: true,
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

UsuarioSchema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id
    return object
})

module.exports = model('Usuario', UsuarioSchema)