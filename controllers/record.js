const {response} = require('express')
const Record = require('../models/record')
const { ordenarRespuestasRecord } = require('../helpers/ordenarRespuestasRecord')

const obtenerRecords = async (req, res = response) => {
    const record = await Record.find()
                                .sort('-createdAt')

    res.status(200).json({
        ok: true,
        record
    })
}

const CrearRecord = async (req, res = response) => {

    try {

        let record = new Record(req.body)

        const preguntas = ordenarRespuestasRecord(record.preguntas)

        record.preguntas = preguntas

        await record.save()

        res.status(201).json({
            ok: true,
            record
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor, Hable con el administrador'
        })
    }
}

const ActualizarRecord = async (req, res = response) => {
    const recordId = req.params.id

    try {

        let record = await Record.findById(recordId)

        if (!record) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un record con este id'
            })
        }

        const nuevoRecord = {
            ...req.body
        }

        const recordActualizado = await Record.findByIdAndUpdate(recordId, nuevoRecord, {new: true})

        res.status(200).json({
            ok: true,
            record: recordActualizado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor, Hable con el administrador'
        })
    }
}

const EliminarRecord = async (req, res = response) => {
    const recordId = req.params.id

    try {

        let record = await Record.findById(recordId)

        if (!record) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un record con este id'
            })
        }

        const recordEliminado = await Record.findByIdAndDelete(recordId)

        res.status(200).json({
            ok: true,
            record: recordEliminado
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
    obtenerRecords,
    CrearRecord,
    ActualizarRecord,
    EliminarRecord
}