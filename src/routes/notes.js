const express = require('express')
const routes = express.Router()
const Note = require('../models/Note')
const {isAuthenticated} = require('../helpers/auth')


routes.get('/notes/add', isAuthenticated , (req,res) =>{
    res.render('notes/new-note')
})

routes.post('/notes/new-note', isAuthenticated, async(req,res) =>{
    const {title, description} = req.body
    const errors = []
    if(!title){
        errors.push({text:'POR FAVOR ESCRIBA UN TITULO PARA LA TAREA'})
    }
    if(!description){
        errors.push({text:'POR FAVOR ESCRIBA UNA DESCRIPCION PARA LA TAREA'})
    }
    if(errors.length>0){
        res.render('notes/new-note',{
            errors,
            title,
            description
        })
    }else{
        const newNotes = new Note({title,description})
        newNotes.user = req.user.id
        await newNotes.save()
        req.flash('success_msg','NOTA AGREGADA EXITOSAMENTE')
        res.redirect('/notes')

    }
   
})

routes.get('/notes', isAuthenticated, async (req,res) =>{
    const notes= await Note.find({user: req.user.id}).sort({date:'desc'})
    res.render('notes/all-notes',{notes})

})

routes.get('/notes/edit/:id', isAuthenticated,async (req,res) =>{
    const note = await Note.findById(req.params.id)
    console.log(note.description)
    res.render('notes/edit-note', {note})
})

routes.put('/notes/edit-note/:id',isAuthenticated, async(req,res) =>{
    const {title, description} = req.body
    await Note.findByIdAndUpdate(req.params.id, {title,description})
    req.flash('success_msg', 'NOTA EDITADA SATISFACTORIAMENTE')
    res.redirect('/notes')
})

routes.delete('/notes/delete/:id',isAuthenticated, async(req,res) =>{
    await Note.findByIdAndDelete(req.params.id)
    res.redirect('/notes')
    req.flash('success_msg', 'NOTA ELIMINADA SATISFACTORIAMENTE')

})


module.exports = routes