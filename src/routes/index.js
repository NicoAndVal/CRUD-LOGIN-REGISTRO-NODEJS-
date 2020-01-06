const express = require('express')
const routes = express.Router()

routes.get('/', (req,res,next) =>{
    res.render('index')
})
routes.get('/about', (req,res,next) =>{
    res.render('about')
})


module.exports = routes