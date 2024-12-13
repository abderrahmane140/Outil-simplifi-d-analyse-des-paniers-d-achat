import express, { Request, Response } from 'express';
import { 
  getTotalSales, 
  getSales, 
  getTrendingProducts, 
  getCategorySales 
} from '../controller/analytics';

const router = express.Router();

// Route to get total sales
router.post('/total_sales', getTotalSales);

// Route to get trending products
router.post('/trending_products', getTrendingProducts);

// Route to get category sales
router.post('/category_sales', getCategorySales);

// Route to get all sales
router.get('/', getSales);

export default router;
