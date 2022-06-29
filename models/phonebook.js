require('dotenv').config()
const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log('connecting...')

})
.catch((err=>{
    console.error('connecting to Database', err.message)
}))

const phoneBookSchema = new Schema({
    name: String,
    number: String,
})

phoneBookSchema.set('toJSON',{
    transform : (document,returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id;
        delete returnObject.__v
    }
})

module.exports = mongoose.model('Phone',phoneBookSchema)
