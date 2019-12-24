const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('@pusher/chatkit-server')

const app = express()

const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:89d1b499-0d13-44e1-94eb-1bfacb823194',
  key: '15a893a4-629f-4a8c-afaf-159f49361215:wGavMFeivKHDIVsJWRv29FH2Cfv8trfB0dTPgRrmIeY='
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.post('/users', (req, res) => {
  const { username } = req.body
  chatkit.createUser({
    id: username,
    name: username
  }).then(() => res.sendStatus(201)).catch(error => {
    if (error.error === 'services/chatkit/user_already_exists') {
      res.sendStatus(200)
    } else {
      res.status(error.status).json(error)
    }
  })
})

app.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({
    userId: req.query.user_id
  })
  res.status(authData.status).send(authData.body)
})

const PORT = 3001
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})
