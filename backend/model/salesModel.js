const mongoose = require('mongoose')

const Schema = mongoose.Schema

const salesSchema = new Schema({
    SaleID:{
        type: Number,
        required:true
    },
    ProductID:{
        type: Number,
        required:true
    },
    Date:{
        type: Date,
        required:true
    },
    TotalAmount:{
        type: Number,
        required:true
    }
})

module.exports = mongoose.model('sales',salesSchema)