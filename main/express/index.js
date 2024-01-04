const express = require('express')
const app = express()
const log = require('electron-log')
const version = '/api/v1/'

// app.use(express.json())
// app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.send('test')
})

app.get(version + 'results', (req, res) => {
  // res.send('test')
  log.info('results')
})

app.get(version + 'images', (req, res) => {
  log.info('images')
  res.send('test')
})

app.listen(18088, () => {
  log.info('server listen')
})
