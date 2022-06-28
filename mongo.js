const mongoose = require('mongoose')

const url = `mongodb+srv://certyfreak:${process.argv[2]}@cluster0.effe2lv.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number:Number,
})

const Person = new mongoose.model('Person',personSchema)


if(process.argv.length <= 3){
    mongoose.connect(url).then(()=>{
        Person.find({}).then((resp)=>{
            let obj = {}
            resp.forEach((data,i)=>{
                obj[++i] = {
                    name: data.name,
                    number: data.number
                }
            })
            console.log('phoneBook :')
            console.table(obj)
            mongoose.connection.close()
        })
        .catch((err)=>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err)

    })
}else if (process.argv.length > 3 ){
    mongoose.connect(url)
    .then(()=>{
        const person = new Person({
            name:process.argv[3],
            number: process.argv[4]
        })
        return person.save()
    })
    .then(()=>{
        console.log(`added ${process.argv[3]-process.argv[4]} added to phoneboook`)
        return mongoose.connection.close()
    })
    .catch((err)=>{
        console.log(err)
    })
}