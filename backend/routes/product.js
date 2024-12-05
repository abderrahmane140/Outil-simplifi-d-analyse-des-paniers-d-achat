const express = require('express')

const getProducts = require('../controller/products')

const router = express.Router();

//get all products
router.get('/',getProducts)

module.exports = router