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

app.post('/', async function (req, res) {
    let username = req.body.username
    let password = req.body.password

    console.log('Received a request ... ')

    let results = await scraper.init(username, password)
    console.log(results)
    res.json(results)
})

app.listen(PORT, () => console.log(`Server started and running at ${PORT}`))