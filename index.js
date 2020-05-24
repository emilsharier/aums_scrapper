const express = require('express')
const bodyParser = require('body-parser')
const scraper = require('./modules/scraper_module')

const PORT = process.env.PORT || 3000

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    console.log(scraper.temp())
})

app.post('/getName', async function (req, res) {
    let username = req.body.username
    let password = req.body.password

    console.log('Received a request ... ')

    let results = await scraper.getName(username, password)
    if (results == 404)
        res.status(404).send('Unable to find user')
    else
        res.status(200).json(results)
    console.log(results)
})

app.post('/getAttendance', async function (req, res) {
    let username = req.body.username
    let password = req.body.password
    let semester = req.body.semester

    console.log('Received a request ... ')

    scraper.getAttendance(username, password, semester).then(val => {
        res.status(200).json(val)
    }).catch(err => {
        console.error()
        res.status(404).send('No Data')
    })
})

app.post('/getinternalmarks', async function (req, res) {
    let username = req.body.username
    let password = req.body.password
    let semester = req.body.semester

    console.log('Received a request ... ')

    scraper.getInternalMarks(username, password, semester).then(results => {
        res.status(200).json(results)
    }).catch(err => {
        console.error()
        res.status(404).send('No Data')
    })
})

app.listen(PORT, () => console.log(`Server started and running at ${PORT}`))