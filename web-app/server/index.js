require('dotenv').config()

const app = require('express')()
const axios = require('axios')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
const upload = multer({})

const { PYTHON_API = 'http://localhost:8080' } = process.env

app.listen(4000)
app.use(cors())

app.get('/', (_, res) => {
  res.send('transcriber server running')
})

app.post('/upload', upload.single('audio'), async (req, res) => {
  const { language = 'en-US', speakers = 2 } = req.query
  const { buffer, mimetype } = req.file

  // save audiofile to ./uploads
  const filename = `${Date.now()}.${mimetype.split('/')[1]}`
  fs.writeFileSync(`./uploads/${filename}`, buffer)

  const transribeResponse = await axios.get(
    `${PYTHON_API}/transcribe?filename=` +
      filename +
      '&language=' +
      language +
      '&speakers=' +
      speakers
  )
  console.log(transribeResponse.data)
  res.send(transribeResponse.data)
})
