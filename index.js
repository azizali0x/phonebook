const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
morgan.token('data',(req,res)=>{
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] :response-time ms :data '))

app.use(express.static('build'))

const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    {
        "id":5,
        "name":"Aziz",
        "number":"3988309833"
    }
]

app.get('/api/persons',(req,res)=>{
    res.json(persons)
})

app.get('/api/persons/:id',(req,res)=>{
    const id = req.params.id
    const getPerson = persons.filter((person)=> person.id === Number(id))
    if(getPerson.length !== 0){
        res.json(getPerson)
    }else{
        res.status(204).end()
    }
})

app.delete('/api/persons/:id',(req,res)=>{
    const id = req.params.id;
    const index = persons.findIndex((person)=> person.id === Number(id))
    const removePerson = persons.splice(index,1)

    if(removePerson){
        res.status(200).end()
        console.log(persons)
    }else{
        res.status(204).end()
    }

})

app.post('/api/persons',(req,res)=>{
    if(req.body.name === undefined || req.body.number === undefined){
        res.status(400).json(
            "number or name can't be empty"
        )
    }else if(persons.find(person=>person.name === req.body.name)){
        res.status(400).json({error:"name must be unique"})
    }else{
        const id = Math.floor(Math.random()* Date.now())
        const data = {
            id,
            name: req.body.name,
            number: req.body.number
        }
        res.status(200).end()
    }
})

app.get('/info',(req,res)=>{
    const time = new Date()
    res.send(
        `<p>Phonebook has info for ${persons.length} people<p>
         <p>${time}</p>
        `
    )
})



const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log('server started')
})