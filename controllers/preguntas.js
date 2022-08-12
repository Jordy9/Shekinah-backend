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

        Preguntas.find().sort('idPregunta').collation({locale: "en_US", numericOrdering: true}).limit(limit).skip(skip).exec((err, preguntas) => {
            Preguntas.count((err, count) => {
                if (err) return false
                res.status(200).json({
                    ok: true,
                    preguntas,
                    page,
                    total: Math.ceil(count/limit),
                    count
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
                    count
                })
            })
        })    
    }

}

const obtenerPreguntasPaginadasJuego = async(req, res = response) => {

    const preguntas = await Preguntas.aggregate(
        [{$sample: {size: 15}}]
    )

    res.status(200).json({
        ok: true,
        preguntas
    })
}

const obtenerPreguntasPaginadasJuegoPersonalizadas = async(req, res = response) => {

    let {categoria, dificultad, pregunta} = req.body
    
    const count = pregunta
    const categ = categoria
    const dific = dificultad

    let countInt = parseInt(count || 15)

    if (categ && dific) {
        const preguntas = await Preguntas.aggregate(
            [
                {
                    $match: { categoria: categ, dificultad: dific }
                },
                {$sample: {size: countInt}}
            ]
        )

        return res.status(200).json({
            ok: true,
            preguntas
        })
    }

    if (categ && !dific) {
        const preguntas = await Preguntas.aggregate(
            [
                {
                    $match: { categoria: categ }
                },
                {$sample: {size: countInt}}
            ]
        )

        return res.status(200).json({
            ok: true,
            preguntas
        })
    }

    if (!categ && dific) {
        const preguntas = await Preguntas.aggregate(
            [
                {
                    $match: { dificultad: dific }
                },
                {$sample: {size: countInt}}
            ]
        )

        return res.status(200).json({
            ok: true,
            preguntas
        })
    }

    if (!categ && !dific) {
        const preguntas = await Preguntas.aggregate(
            [{$sample: {size: countInt}}]
        )

        return res.status(200).json({
            ok: true,
            preguntas
        })
    }
}

const obtenerPreguntasPorId = async(req, res = response) => {

    if (req.body.ids.includes('-')) {
        const numero1 = req.body.ids.split('-')[0]
        const numero2 = req.body.ids.split('-')[1]
        const preguntas = await Preguntas.find({idPregunta: { $gte : numero1 , $lte : numero2}}).sort('idPregunta').collation({locale: "en_US", numericOrdering: true})
        
        res.status(200).json({
            ok: true,
            preguntas
        })
    } else {
        const preguntas = await Preguntas.find({idPregunta: {$in:req.body.ids.split(',')}})

        res.status(200).json({
            ok: true,
            preguntas
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
    obtenerPreguntasPaginadasJuego,
    obtenerPreguntasPaginadasJuegoPersonalizadas,
    obtenerPreguntasPorId,
    CrearPregunta,
    ActualizarPregunta,
    EliminarPregunta,
}