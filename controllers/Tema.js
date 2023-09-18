const {response} = require('express')
const Temas = require('../models/Temas')

const obtenerTemas = async (req, res = response) => {

    let {page, size, searchParams} = req.query

    const searchRegex = new RegExp(searchParams, 'i');

    if (!searchRegex) {
        searchRegex = ''
    }

    // if (!page) {
    //     page = 1
    // }

    // if (!size) {
    //     size = 50
    // }

    // const limit = parseInt(size)
    // const skip = (page - 1) * size

    // let promiseTema
    // let countTema

    // if ( searchRegex ) {
    //     promiseTema = Temas.find({ tema: searchRegex }).sort('createdAt').limit(limit).skip(skip)
    //     countTema = Temas.find({ tema: searchRegex }).countDocuments()
    // } else {
    //     promiseTema = Temas.find().sort('createdAt').limit(limit).skip(skip)
    //     countTema = Temas.find().countDocuments()
    // }

    let promiseTema
    let countTema
    
    if ( searchRegex ) {
        promiseTema = Temas.find({ tema: searchRegex }).sort('createdAt')
        // countTema = Temas.find({ tema: searchRegex }).countDocuments()
    } else {
        promiseTema = Temas.find({ tema: searchRegex }).sort('createdAt')
        // countTema = Temas.find({ tema: searchRegex }).countDocuments()
    }


    const [ temas ] = await Promise.all([
        promiseTema,
        // countTema
    ])

    res.status(200).json({
        ok: true,
        temas,
        // page: parseInt(page),
        // total: Math.ceil(count/limit),
        // count
    })
}

const CrearTemas = async (req, res = response) => {

    try {

        let tema = new Temas(req.body)

        await tema.save()

        res.status(201).json({
            ok: true,
            tema
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor, Hable con el administrador'
        })
    }
}

const ActualizarTemas = async (req, res = response) => {
    const temaId = req.params.id

    try {

        let tema = await Temas.findById(temaId)

        if (!tema) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un tema con este id'
            })
        }

        const nuevoTema = {
            ...req.body
        }

        const temaActualizado = await Temas.findByIdAndUpdate(temaId, nuevoTema, {new: true})

        res.status(200).json({
            ok: true,
            tema: temaActualizado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor, Hable con el administrador'
        })
    }
}

const EliminarTema = async (req, res = response) => {
    const temaId = req.params.id

    try {

        let tema = await Temas.findById(temaId)

        if (!tema) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un tema con este id'
            })
        }

        const temaEliminado = await Temas.findByIdAndDelete(temaId)

        res.status(200).json({
            ok: true,
            tema: temaEliminado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor, Hable con el administrador'
        })
    }
}

module.exports = {
    obtenerTemas,
    CrearTemas,
    ActualizarTemas,
    EliminarTema
}