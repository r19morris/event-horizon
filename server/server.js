const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('Event Horizon live!')
})

app.listen(port, () => {
  console.log(`Event Horizon listening on port ${port}`)
})
