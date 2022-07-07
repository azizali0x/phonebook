require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
// const Phone = require('./models/phonebook')

mongoose.connect(process.env.MONGODB_URI).then((resp)=>{
  console.log('connecting..');
})
    .catch((err)=>{
    });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator(v) {
        return /^[1-9]\d{2}-\d{7}/.test(v) || /^[1-9]\d{1}-\d{8}/.test(v);
      },
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString();
    delete returnObject._id;
    delete returnObject.__v;
  },
});

const Person = mongoose.model('Person', personSchema);


app.use(express.static('build'));
app.use(express.json());
app.use(cors());
morgan.token('data', (req, res)=>{
  return JSON.stringify(req.body);
});

// eslint-disable-next-line max-len
app.use(morgan(':method :url :status :res[content-length] :response-time ms :data '));


app.get('/api/persons', (req, res, next)=>{
  // Person.find({}).then(val=>{
  //     res.json(val)
  // }).catch(err=>{n
  //     console.log(err)
  // })

  Person.find({}).then((resp)=>{
    res.json(resp);
  }).catch((err)=>{
    next(err);
  });
});

app.get('/api/persons/:id', (req, res, next)=>{
  Person.findById(req.params.id).then((resp)=>{
    if (resp) {
      res.status(200).json(resp);
    }
  }).catch((err)=> next(err));
});

app.delete('/api/persons/:id', (req, res, next)=>{
  Person.findByIdAndRemove(req.params.id).then(()=>{
    res.status(200).end();
  }).catch((err)=> next(err));
});

app.post('/api/persons', (req, res, next)=>{
  if (req.body.name === undefined || req.body.number === undefined) {
    res.status(400).json(
        'number or name can\'t be empty',
    );
  } else {
    const person = new Person({
      name: req.body.name,
      number: req.body.number,
    });
    person.save().then(()=>{
      res.status(200).end();
    }).catch((err)=>{
      next(err);
    });
  }
});

app.put('/api/persons/:id', (req, res, next)=>{
  console.log('yes');
  Person.findByIdAndUpdate(req.params.id, {
    name: req.body.name, number: req.body.number},
  {new: true})
      .then(()=>{
        res.status(204).end();
      }).catch((err)=> next(err));
});

app.get('/info', (req, res, next)=>{
  const time = new Date();
  Person.find({}).then((resp)=>{
    res.send(
        `<p>Phonebook has info for ${resp.length} people<p>
             <p>${time}</p>
            `,
    );
  }).catch((err)=> next(err));
});

const errorHandler = (err, req, res, next)=>{
  if (err.name === 'ValidationError') {
    return res.status(400).json({message: err.message});
  }
  if (err.message) {
    return res.status(400).json({message: err.message});
  }s;
  next(err.message);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log('server started');
});
