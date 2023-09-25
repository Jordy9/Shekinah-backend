const {response} = require('express')
const PreguntasTema = require('../models/PreguntasTema')

const obtenerPreguntasTemas = async (req, res = response) => {

    let {page, size, searchParams} = req.query

    const searchRegex = new RegExp(searchParams, 'i');

    if (!searchRegex) {
        searchRegex = ''
    }

    if (!page) {
        page = 1
    }

    if (!size) {
        size = 50
    }

    const limit = parseInt(size)
    const skip = (page - 1) * size

    let promisePreguntasTemas
    let countPreguntasTemas

    if ( searchRegex ) {
        promisePreguntasTemas = PreguntasTema.find({ pregunta: searchRegex }).sort('createdAt').limit(limit).skip(skip)
        countPreguntasTemas = PreguntasTema.find({ pregunta: searchRegex }).countDocuments()
    } else {
        promisePreguntasTemas = PreguntasTema.find().sort('createdAt').limit(limit).skip(skip)
        countPreguntasTemas = PreguntasTema.find().countDocuments()
    }

    const [ preguntas, count ] = await Promise.all([
        promisePreguntasTemas,
        countPreguntasTemas
    ])

    res.status(200).json({
        ok: true,
        preguntas,
        page: parseInt(page),
        total: Math.ceil(count/limit),
        count
    })
}

const CrearPreguntaTema = async (req, res = response) => {

    try {

        let pregunta = new PreguntasTema(req.body)

        await pregunta.save()

        res.status(201).json({
            ok: true,
            pregunta
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor, Hable con el administrador'
        })
    }
}

const ActualizarPreguntaTema = async (req, res = response) => {
    const preguntaTemaId = req.params.id

    try {

        let pregunta = await PreguntasTema.findById(preguntaTemaId)

        if (!pregunta) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una pregunta con este id'
            })
        }

        const nuevaPregunta = {
            ...req.body
        }

        const preguntaActualizada = await PreguntasTema.findByIdAndUpdate(preguntaTemaId, nuevaPregunta, {new: true})

        res.status(200).json({
            ok: true,
            pregunta: preguntaActualizada
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor, Hable con el administrador'
        })
    }
}

const EliminarPreguntaTema = async (req, res = response) => {
    const preguntaTemaId = req.params.id

    try {

        let pregunta = await PreguntasTema.findById(preguntaTemaId)

        if (!pregunta) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una pregunta con este id'
            })
        }

        const preguntaEliminada = await PreguntasTema.findByIdAndDelete(preguntaTemaId)

        res.status(200).json({
            ok: true,
            pregunta: preguntaEliminada
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
    obtenerPreguntasTemas,
    CrearPreguntaTema,
    ActualizarPreguntaTema,
    EliminarPreguntaTema
}