const express = require('express')
const path = require('path')
const { dbConnection } = require('./database/config')
require('dotenv').config()
const cors = require('cors')

const PORT = process.env.PORT

// Crear el servidor de express
const app = express()

// Base de datos
dbConnection()

// Cors
app.use(cors())

// Directorio publico
app.use(express.static('public'))

// Lectura y parseo del body

app.use(express.json())

// Rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/pregunta', require('./routes/preguntas'))
app.use('/api/record', require('./routes/record'))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`Server en el puerto ${PORT}`)
})