const express = require('express');
const app = express();
const err = require('./middlewares/errorHandler');


let connectDB = require('./database');
let db;
connectDB.then((client) => {
    db = client.db(process.env.DB_NAME)
    console.log('Database connected');
    app.listen(process.env.PORT,()=>{
        console.log('Server is running');
    })
}).catch((e) => {
    console.log('Error starting server:', e);
})



app.get('/',(req,res)=>{
    res.send('Hello World');
})