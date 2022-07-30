const {response} = require('express')
const Usuario = require('../models/Usuario')
const bcript = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt')
const {OAuth2Client} = require('google-auth-library');
const fetch = require('node-fetch')

const googleIdAccount = process.env.googleIdApiAccount

const client = new OAuth2Client(`${googleIdAccount}`)

const obtenerUsuario = async (req, res = response) => {
    const usuarios = await Usuario.find()
                                    .sort('-juego.puntos')

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

const actualizarContrasena = async (req, res = response) => {
    const usuarioId = req.params.id
    const {passwordActual, password} = req.body

    try {

        const usuario = await Usuario.findById(usuarioId)

        // Confirmar la contrasena

        const validPassword = bcript.compareSync(passwordActual, usuario.password)

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña es incorrecta'
            })
        }

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

const googleLogin = async (req, res = response) => {

    const {credential} = req.body
    // console.log(req.body)

    const cliente = await client.verifyIdToken({
        idToken: credential, 
        audience: `${googleIdAccount}`,
    })
    
    const { given_name, family_name, email, name, email_verified } = cliente.payload

    if (!email_verified) {
       return res.status(400).json({
        ok: false,
        msg: 'Hubo un problema al iniciar sesión con este usuario1'
       }) 
    }

    try {
        let usuario = await Usuario.findOne({email});
    
    if (!usuario) {

        let password = `Y@${email} ${name}147852369`

        usuario = new Usuario({
            name: given_name, 
            lastName: family_name,
            email: email,
            password: password,
        });

        //Encriptar contrasena

        const salt = bcript.genSaltSync();
        usuario.password = bcript.hashSync(password, salt);

        await usuario.save()
    }

    //Generar JWT

    const token = await generarJWT(usuario.id, usuario.name)

    res.json({
        ok: true,
        uid: usuario.id,
        name: usuario.name,
        token
    })
    } catch (error) {
        console.log(error)
    }
}

const facebookLogin = async (req, res = response) => {

    const {userID, accessToken} = req.body
    

    let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`

    const resp = await fetch(urlGraphFacebook, {
        method: 'GET',
        mode: 'cors'
        
    })

    const body = await resp.json()

    const { name, email } = body

    const nameSplit = name.split(" ")

    const lastName = name.slice(5)

    if (!email) {
       return res.status(400).json({
        ok: false,
        msg: 'Hubo un problema al iniciar sesión con este usuario1'
       }) 
    }

    try {
        let usuario = await Usuario.findOne({email});

    // if (!users) {
    //     return res.status(400).json({
    //         ok: false,
    //         msg: 'Hubo un problema al iniciar sesión con este usuario2'
    //     })
    // }

    
    if (!usuario) {

        let password = `Y@${email} ${name}147852369`

        usuario = new Usuario({
            name: nameSplit[0], 
            lastName: lastName,
            email: email,
            password: password,
        });

        //Encriptar contrasena

        const salt = bcript.genSaltSync();
        usuario.password = bcript.hashSync(password, salt);

        await usuario.save()
    }

    //Generar JWT

    const token = await generarJWT(usuario.id, usuario.name)

    res.json({
        ok: true,
        uid: usuario.id,
        name: usuario.name,
        token
    })
    } catch (error) {
        console.log(error)
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
    actualizarContrasena,
    eliminarUsuario,
    loginUsuario,
    googleLogin,
    facebookLogin,
    revalidarToken
}