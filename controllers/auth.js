const {response} = require('express')
const Usuario = require('../models/Usuario')
const bcript = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt')

const obtenerUsuario = async (req, res = response) => {
    const usuarios = await Usuario.find()
                                    .sort('-createdAt')

    res.status(200).json({
        ok: false,
        usuarios
    })
}

const crearUsuario = async (req, res = response) => {

    const {email, password} = req.body

    try {

        let usuario = await Usuario.findOne({email})

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo electrónico'
            })
        }

        usuario = new Usuario(req.body)
    
        // Encriptar contrasena

        const salt = bcript.genSaltSync();
        usuario.password = bcript.hashSync(password, salt)

        await usuario.save()

        // Generar JWT

        const token = await generarJWT(usuario.id, usuario.name)

    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

}

const actualizarUsuario = async (req, res = response) => {
    const usuarioId = req.params.id
    const {password} = req.body

    try {

        const usuario = await Usuario.findById(usuarioId)

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con este id'
            })
        }

        const nuevoUsuario = {
            ...req.body
        }

        if (usuario.password !== password) {
            const salt = bcript.genSaltSync()
            nuevoUsuario.password = bcript.hashSync(password, salt)
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(usuarioId, nuevoUsuario, {new: true})

        res.status(200).json({
            ok: true,
            usuario: usuarioActualizado
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador'
        })
    }

}

const eliminarUsuario = async (req, res = response) => {
    const usuarioId = req.params.id

    try {

        const usuario = await Usuario.findById(usuarioId)

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con este id'
            })
        }

        const usuarioEliminado = await Usuario.findByIdAndDelete(usuarioId)
        
        res.status(200).json({
            ok: true,
            usuario: usuarioEliminado
        })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador'
        })
    }
}

const loginUsuario = async (req, res = response) => {

    const {email, password} = req.body

    
    try {
        let usuario = await Usuario.findOne({email})

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            })
        }

        // Confirmar la contrasena

        const validPassword = bcript.compareSync(password, usuario.password)

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña es incorrecta'
            })
        }

        // Generar nuestro JWT

        const token = await generarJWT(usuario.id, usuario.name)
        
        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador'
        })
    }

}

const revalidarToken = async (req, res = response) => {

    const {uid, name} = req

    // Generar nuestro JWT

    const token = await generarJWT(uid, name)

    res.status(200).json({
        ok: true,
        uid,
        name,
        token
    })
}

module.exports = {
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    loginUsuario,
    revalidarToken
}