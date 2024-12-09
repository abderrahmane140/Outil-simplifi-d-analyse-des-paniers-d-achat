const express = require('express')

const {getTotalSales, getSales, getTrendingProducts, getCategorySales }= require('../controller/analytics')

const router = express.Router();

router.post('/total_sales',getTotalSales)
router.get('/trending_products',getTrendingProducts)
router.get('/category_sales',getCategorySales)
router.get('/',getSales)

module.exports = router;