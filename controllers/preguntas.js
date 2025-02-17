const {response} = require('express')
const Preguntas = require('../models/Preguntas')
const PreguntasTema = require('../models/PreguntasTema')
const { compararPorId } = require('../helpers/ordenarPreguntas')
const { shuffle } = require('../helpers/ordenarRespuestasRecord')

const obtenerPreguntas = async (req, res = response) => {
    const preguntas = await Preguntas.find()
                                        .sort('-createdAt')

    res.status(200).json({
        ok: true,
        preguntas
    })
}

const obtenerPreguntasPorTema = async (req, res = response) => {

    let { value } = req.query

    if ( !value ) {
        return res.status(400).json({
            ok: false,
            preguntas: []
        })
    }

    const [ preguntasNormales, preguntasParaTema ] = await Promise.all([
        Preguntas.find({ tema: { $eq: value } }).sort('createdAt'),
        PreguntasTema.find({ tema: { $eq: value } }).sort('createdAt')
    ])

    const preguntas = [ ...preguntasNormales, ...preguntasParaTema ]

    res.status(200).json({
        preguntas
    })
}

const JugarPreguntasPorTema = async (req, res = response) => {

    let { value } = req.query

    value = value.split(',')

    if ( value.length === 0 ) {
        return res.status(400).json({
            ok: false,
            preguntas: []
        })
    }

    const [ preguntasNormales, preguntasParaTema ] = await Promise.all([
        Preguntas.find({ _id: { $in: value } }),
        PreguntasTema.find({ _id: { $in: value } })
    ])

    const preguntas = [ ...preguntasNormales, ...preguntasParaTema ]

    const preguntasOrdenadas = preguntas.sort((a, b) => compararPorId(a, b, value))

    res.status(200).json({
        preguntas: preguntasOrdenadas
    })
}

const JugarPreguntasAnalisis = async (req, res = response) => {

    let { opcion } = req.query

    const size = ( opcion === 'rapido' ) ? 5 : 10

    const [ tiernas, medias, avanzadas ] = await Promise.all([
        Preguntas.aggregate([
            { $match: { dificultad: 'Tierno' } },
            { $sample: { size } }
        ]),
        Preguntas.aggregate([
            { $match: { dificultad: 'Medio' } },
            { $sample: { size } }
        ]),
        Preguntas.aggregate([
            { $match: { dificultad: 'Avanzado' } },
            { $sample: { size } }
        ])
    ])

    const preguntas = [ ...tiernas, ...medias, ...avanzadas ]

    const preguntasDesordenadas = shuffle(preguntas)

    res.status(200).json({
        preguntas: preguntasDesordenadas
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

    const { dificultad } = req.query

    let preguntas

    if ( dificultad === 'Avanzado' ) {
        preguntas = await Preguntas.aggregate(
            [{$sample: {size: 15}}]
        )
    } else {
        preguntas = await Preguntas.aggregate([
            { $match: { dificultad: dificultad } },
            { $sample: { size: 15 } }
        ])
    }

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
        const value = req.body.ids.split('-')
        const numero1 = req.body.ids.split('-')[0]
        const numero2 = req.body.ids.split('-')[1]

        const operation = Number(numero2) - Number(numero1)

        if ( operation > 100 ) {
            return res.status(400).json({
                ok: false,
                msg: 'El máximo de preguntas debe ser de 100'
            })
        }

        if ( operation <= 0 ) {
            return res.status(400).json({
                ok: false,
                msg: 'El mínimo de preguntas debe ser de 1'
            })
        }

        const preguntasEncontradas = await Preguntas.find({idPregunta: { $gte : numero1 , $lte : numero2}}).sort('idPregunta').collation({locale: "en_US", numericOrdering: true})

        const preguntas = preguntasEncontradas.sort((a, b) => compararPorId(a, b, value))
        
        res.status(200).json({
            ok: true,
            preguntas
        })

    } else {

        const value = req.body.ids.split(',')

        if ( value.length > 100 ) {
            return res.status(400).json({
                ok: false,
                msg: 'El máximo de preguntas debe ser de 100'
            })
        }

        const preguntasEncontradas = await Preguntas.find({idPregunta: {$in:req.body.ids.split(',')}})

        const preguntas = preguntasEncontradas.sort((a, b) => compararPorId(a, b, value))

        res.status(200).json({
            ok: true,
            preguntas
        })
    }

}

const CrearPregunta = async (req, res = response) => {

    try {

        Preguntas.count(async (err, count) => {

            let idPregunta = count + 1

            const nuevaPregunta = {
                ...req.body,
                idPregunta
            }

            let pregunta = new Preguntas(nuevaPregunta)
    
            await pregunta.save()
    
            res.status(201).json({
                ok: true,
                pregunta
            })
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
    obtenerPreguntasPorTema,
    JugarPreguntasPorTema,
    obtenerPreguntasPaginadas,
    obtenerPreguntasPaginadasJuego,
    obtenerPreguntasPaginadasJuegoPersonalizadas,
    obtenerPreguntasPorId,
    JugarPreguntasAnalisis,
    CrearPregunta,
    ActualizarPregunta,
    EliminarPregunta,
}