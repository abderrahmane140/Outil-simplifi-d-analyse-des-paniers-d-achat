const express = require('express')

const {getTotalSales, getSales, getTrendingProducts, getCategorySales }= require('../controller/analytics')

const router = express.Router();

router.post('/total_sales',getTotalSales)
router.post('/trending_products',getTrendingProducts)
router.post('/category_sales',getCategorySales)
router.get('/',getSales)

module.exports = router;