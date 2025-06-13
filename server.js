const express = require('express');
const app = express();
const errorHandler = require('./middlewares/errorHandler');
const cors =require('cors');


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

app.use(cors());
app.use(express.json());


app.use('/auth',require('./routes/auth.js'));



app.use(errorHandler);