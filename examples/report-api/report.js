
const express = require('express')
const cors = require('cors')
const app = express()


app.use(cors())

app.use(express.urlencoded({ extended: false }))

app.get('/report', (req, res) => {
  console.log(req.query)
  res.end("ok~")
})

app.post('/report', (req, res) => {
  console.log(req.body)
  res.end("ok~")
})

app.listen('8088', () => {
  console.log('服务器启动成功~~  ')
})