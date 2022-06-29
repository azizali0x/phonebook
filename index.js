require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
// const Phone = require('./models/phonebook')

mongoose.connect(process.env.MONGODB_URI).then((resp)=>{
    console.log('connecting..')
})
.catch(err=>{
    console.error(err)
})

const personSchema = new  mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON',{
    transform : (document,returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id;
        delete returnObject.__v
    }
})

const Person = mongoose.model('Person',personSchema)


app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('data',(req,res)=>{
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] :response-time ms :data '))


app.get('/api/persons',(req,res)=>{

    // Person.find({}).then(val=>{
    //     res.json(val)
    // }).catch(err=>{n
    //     console.log(err)
    // })

    Person.find({}).then((resp)=>{
        res.json(resp)
    }).catch(err=>{
        console.error(err)
    })
})

// app.get('/api/persons/:id',(req,res)=>{
//     const id = req.params.id
//     const getPerson = persons.filter((person)=> person.id === Number(id))
//     if(getPerson.length !== 0){
//         res.json(getPerson)
//     }else{
//         res.status(204).end()
//     }
// })

// app.delete('/api/persons/:id',(req,res)=>{
//     const id = req.params.id;
//     const index = persons.findIndex((person)=> person.id === Number(id))
//     const removePerson = persons.splice(index,1)

//     if(removePerson){
//         res.status(200).end()
//         console.log(persons)
//     }else{
//         res.status(204).end()
//     }

// })

app.post('/api/persons',(req,res)=>{
    if(req.body.name === undefined || req.body.number === undefined){
        res.status(400).json(
            "number or name can't be empty"
        )
    }else{
        const  person = new Person({
            name: req.body.name,
            number: req.body.number,
        })
        person.save()
        res.status(200).end()
    }
})

// app.get('/info',(req,res)=>{
//     const time = new Date()
//     res.send(
//         `<p>Phonebook has info for ${persons.length} people<p>
//          <p>${time}</p>
//         `
//     )
// })



const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log('server started')
})