
const express = require('express')
const path = require('path')
const PORT =  1100

express()
  .use(express.static(path.join(__dirname, '')))
  .get('/', (req, res) => res.render('index.html'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))