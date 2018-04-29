const express = require('express')
const app = express()
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('link-to-mongodb', (err, database) => {
    if(err) return console.log(err)
    db = database

    app.listen(3000, function() {
        console.log('listening on 3000')
    })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    db.collection('quotes').find().toArray((err, result) => {
        if(err) return console.log(err)

        res.render('index.ejs', {quotes: result})
    })
})

app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
        if(err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')
    })
})

app.put('/quotes', (req, res) => {
    db.collection('quotes')
    .findOneAndUpdate({}, {
        $set: {
        name: req.body.name,
        quote: req.body.quote
        }
    }, {
        sort: {_id: -1}
    }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
    })
})

app.delete('/quotes', (req, res) => {
    db.collection('quotes')
    .findOneAndDelete({},
    (err, result) => {
        if (err) return res.send(500, err)
        res.send({message: 'A quote got deleted'})
    })
})