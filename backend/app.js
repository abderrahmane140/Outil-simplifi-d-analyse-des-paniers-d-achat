require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');

const productRouter = require('./routes/product')
const analyticsRouter = require('./routes/analytics')

const app = express();

app.use(express.json());

app.use(
    cors({
      origin: process.env.URL_API_FRONTEND, // Only allow this frontend
    })
  );
  

//router
app.use('/products',productRouter)
app.use('/analytics',analyticsRouter)

mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(process.env.PORT, () => {
        console.log("conncet to db & listen to port", process.env.PORT);
    })
}).catch((err)=>{
    console.log(err);
})