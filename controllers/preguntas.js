const {response} = require('express')
const Preguntas = require('../models/Preguntas')

const obtenerPreguntas = async (req, res = response) => {
    const preguntas = await Preguntas.find()
                                        .sort('-createdAt')

    res.status(200).json({
        ok: true,
        preguntas
    })
}

const obtenerPreguntasPaginadas = async(req, res = response) => {

    let {page, size, searchParams} = req.query

    if (!searchParams) {
        searchParams = ''
    }

    if (!page) {
        page = 1
    }

    if (!size) {
        size = 10
    }

    const limit = parseInt(size)
    const skip = (page - 1) * size

    if (searchParams === '') {

        Preguntas.find().sort('-createdAt').limit(limit).skip(skip).exec((err, preguntas) => {
            Preguntas.count((err, count) => {
                if (err) return false
                res.status(200).json({
                    ok: true,
                    preguntas,
                    page,
                    total: Math.ceil(count/limit),
                })
            })
        })

    } else {

        Preguntas.find({idPregunta: searchParams}).sort('-createdAt').limit(limit).skip(skip).exec((err, preguntas) => {
            Preguntas.count((err, count) => {
                if (err) return false
                res.status(200).json({
                    ok: true,
                    preguntas,
                    page,
                    total: Math.ceil(count/limit),
                })
            })
        })    
    }

}

const CrearPregunta = async (req, res = response) => {

    try {

        let pregunta = new Preguntas(req.body)

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

const ActualizarPregunta = async (req, res = response) => {
    const preguntaId = req.params.id

    try {

        let pregunta = await Preguntas.findById(preguntaId)

        if (!pregunta) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una pregunta con este id'
            })
        }

        const nuevaPregunta = {
            ...req.body
        }

        const preguntaActualizada = await Preguntas.findByIdAndUpdate(preguntaId, nuevaPregunta, {new: true})

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

const EliminarPregunta = async (req, res = response) => {
    const preguntaId = req.params.id

    try {

        let pregunta = await Preguntas.findById(preguntaId)

        if (!pregunta) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una pregunta con este id'
            })
        }

        const preguntaEliminada = await Preguntas.findByIdAndDelete(preguntaId)

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
    obtenerPreguntas,
    obtenerPreguntasPaginadas,
    CrearPregunta,
    ActualizarPregunta,
    EliminarPregunta,
}