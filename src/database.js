const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/notes-db-app',{
    useUnifiedTopology: true,
    useNewUrlParser: true 
})
.then(db => console.log('DB IS CONNECT'))
.catch(err => console.error(err))