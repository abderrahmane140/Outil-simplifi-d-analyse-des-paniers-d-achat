const express = require('express')

const getProductsWithSales = require('../controller/products')

const router = express.Router();

//get all products
router.get('/',getProductsWithSales)

module.exports = router