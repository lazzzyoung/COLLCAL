const express = require('express');
const app = express();
const err = require('./middlewares/errorHandler');


let connectDB = require('./database');
let db;
connectDB.then((client) => {
    db = client.db(process.env.DB_NAME)
    app.listen(process.env.PORT,()=>{
        console.log('Server is running');
    }).catch((err) => {
        console.log('Error starting server:', err);
    })
})



app.get('/',(req,res)=>{
    res.send('Hello World');
})