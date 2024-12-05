const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
    ProductID:{
        type:Number,
        require:true
    },
    ProductName:{
        type:String,
        require:true
    },
    Category: {
        type:String,
        require:true
    },
    Price: {
        type:Number,
        require:true
    }
})

module.exports = mongoose.model("product", productSchema)