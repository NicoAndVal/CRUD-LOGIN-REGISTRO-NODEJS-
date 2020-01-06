const express = require('express')
const routes = express.Router()
const User = require('../models/User')
const passport = require('passport')

routes.get('/users/signin', (req,res)=>{
    res.render('users/signin')
})

routes.post('/users/signin', passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash:true
}))

routes.get('/users/signup', (req,res)=>{
    res.render('users/signup')
})

routes.post('/users/signup', async(req,res) =>{
    const {name,email,password,confirm_password} = req.body
    let errors = []
    if(name.length<=0){
        errors.push({text: 'POR FAVOR AGREGUE SU NOMBRE'})
    }

    if(password != confirm_password){
        errors.push({text: 'LAS CONTRASEÑAS NO COINCIDEN'})
    }
    if(password.length < 4){
        errors.push({text: 'LA CONTRASEÑA DEBE TENER AL MENOS 4 CARACTERES'})
    }
    if(errors.length>0){
        res.render('users/signup',{errors,name,email,password,confirm_password})
    }else{
        const emailUser = await User.findOne({email:email})
        if(emailUser){
            req.flash('error_msg','El correo ya está en uso')
            res.redirect('/users/signup')
        }
        const newUser = new User({name,email,password})
        newUser.password = await newUser.encryptPassword(password)
        await newUser.save()
        req.flash('success_msg', 'Estas Registrado')
        res.redirect('/users/signin')
    }

})

routes.get('/users/logout', (req,res) =>{
    req.logout()
    res.redirect('/')
})



module.exports = routes