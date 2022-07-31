
const express = require('express')
const cors = require('cors')
const app = express()


app.use(cors())

app.use(express.urlencoded({ extended: false }))

app.post('/report', (req, res, next) => {
  console.log(req.body)
  res.end("ok~")
})

app.listen('8088', () => {
  console.log('服务器启动成功~~  ')
})