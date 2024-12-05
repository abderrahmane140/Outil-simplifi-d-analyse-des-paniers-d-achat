require('dotenv').config()
const { config } = require('dotenv');
const express = require('express')
const mongoose = require('mongoose')

const productRouter = require('./routes/product')

const app = express();

app.use(express.json());


//router
app.use('/products',productRouter)

mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(process.env.PORT, () => {
        console.log("conncet to db & listen to port", process.env.PORT);
    })
}).catch((err)=>{
    console.log(err);
})