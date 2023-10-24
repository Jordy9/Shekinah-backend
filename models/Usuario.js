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
    juego: {
        type: Object
    },
    role: {
        type: String,
        default: 'usuario',
        required: true,
    },
    tema: {
        type: String,
        default: '#4a148c'
    },
    selected: {
        type: String,
        default: '#4a148c'
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ["Tierno", "Medio", "Avanzado"]
    },
    isLevel: {
        type: Boolean,
        default: true,
    },
    nextLevel: {
        type: Number,
        required: true,
        default: 0,
    },
    notifyLevel: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: Object,
        default: {
            name: '',
            category: 'initials',
            backGround: 'transparent',
            radius: 0,
            flip: false,
            rotate: 0,
            translateX: 0,
            translateY: 0
        }
    },
    estado: {
        type: Boolean,
        default: true
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