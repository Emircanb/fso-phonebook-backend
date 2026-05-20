const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}


const password = process.argv[2]

const url = `mongodb://emircanbereketcse_db_user:${password}@ac-a13yfc3-shard-00-00.zwgwgmg.mongodb.net:27017,ac-a13yfc3-shard-00-01.zwgwgmg.mongodb.net:27017,ac-a13yfc3-shard-00-02.zwgwgmg.mongodb.net:27017/personApp?ssl=true&replicaSet=atlas-t19bk7-shard-0&authSource=admin&appName=Cluster0&retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name: name,
    number: number,
  })
  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}