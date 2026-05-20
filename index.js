require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const mongoose = require('mongoose')
const Person = require('./models/person')



app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body '))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    Person.countDocuments({}).then(count => {
        const date = new Date()
        response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
    }
    )
})

app.delete('/api/persons/:id', (request, response, next) => {
    console.log('Deleting person with id:', request.params.id)
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            console.log('Delete result:', result)
            response.status(204).end()
        })
        .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    if (!name || !number){ 
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    Person.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).end()
            }
        
            person.name = name
            person.number = number

            return person.save().then(updatedPerson => {
                response.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const {name, number} = request.body
    if (!name || !number){ 
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


