const Product = require('../model/productModel')



//get all the  products

const getProducts = async (req,res) => {
    try{
        const products = await Product.find({})
        res.status(200).json(products)
    }catch(err){
        console.log(err);
    }
}

module.exports = getProducts